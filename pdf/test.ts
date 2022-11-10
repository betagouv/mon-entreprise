import { readFileSync, writeFileSync } from 'fs'
import { PdfData, VerbosityLevel } from 'pdfdataextract'

const fileData = readFileSync('ape-naf.pdf')

interface Custom {
	[code: string]: {
		contenuCentral: string[]
		contenuAnnexe: string[]
		contenuExclu: string[]
	}
}

const CUSTOM: Custom = {
	'62.01Z': {
		contenuCentral: ['développeur', 'informatique', 'web'],
		contenuAnnexe: [],
		contenuExclu: [],
	},
}

void PdfData.extract(fileData, {
	// pages: 6, // how many pages should be read at most
	sort: true, // sort the text by text coordinates
	verbosity: VerbosityLevel.ERRORS, // set the verbosity level for parsing
}).then(({ text }) => {
	writeFileSync('./test.txt', text?.join('\n\n[[[NEW PAGE]]]\n\n') ?? '')
	writeFileSync('./test.json', JSON.stringify(transformText(text), null, 2))
})

const transformText = (pages: PdfData['text']) => {
	if (!pages) {
		throw new Error('No text found')
	}

	const normalize = (str: string) =>
		str.replace(/\s+/g, ' ').replace(/\s+;/g, ';')

	const previous: {
		index: {
			section: number | null
			division: number | null
			groupe: number | null
			classe: number | null
			sousClasse: number | null
			catégorie: number | null
			sousCatégorie: number | null
		}
		contenuType: 'contenuCentral' | 'contenuAnnexe' | 'contenuExclu' | null
	} = {
		index: {
			section: null,
			division: null,
			groupe: null,
			classe: null,
			sousClasse: null,
			catégorie: null,
			sousCatégorie: null,
		},
		contenuType: null,
	}

	return pages.reduce((arr, page, pageIndex) => {
		const passPage = pageIndex === 0 || page.match(/Table des matières/)
		if (passPage) {
			return arr
		}

		const lines = page
			.replace(/([A-Z])\s\n([A-Z])|([^A-Z])\s\n([^A-Z0-9\s])/g, '$1$3 $2$4')
			.split('\n')

		for (let j = 0; j < lines.length; j++) {
			// pageIndex < 5 &&
			console.log('###', '>' + lines[j] + '<')

			const line = lines[j].trim()
			const passLine = line.match(
				/Nomenclature d’Activités Française NAF|Classification des Produits Française CPF/
			)
			if (line === '' || passLine) {
				console.log('[pass]')

				continue
			}

			const section = line.match(/^Section ([A-Z]) :\s+([^\n]+)$/)
			const division = line.match(/^(\d{2})\s+(\w[^\n]+)$/)
			const groupe = line.match(/^(\d{2}\.\d)\s+([^\n]+)$/)
			const classe = line.match(/^(\d{2}\.\d{2})\s+([^\n]+)$/)
			const sousClasse = line.match(/^(\d{2}\.\d{2}[A-Z])\s+([^\n]+)$/)

			const catégorie = line.match(/^(\d{2}\.\d{2}\.\d)\s+([^\n]+)$/)
			const sousCatégorie = line.match(/^(\d{2}\.\d{2}\.\d{2})\s+([^\n]+)$/)

			const contenuCentral = line.match(/^(CC) :[•-\s]*([^\n]+)$/)
			const contenuAnnexe = line.match(/^(CA) :[•-\s]*([^\n]+)$/)
			const contenuExclu = line.match(/^(NC) :[•-\s]*([^\n]+)$/)

			const comprend = line.match(/^Cette .+ comprend :$/)
			const comprendAussi = line.match(/^Cette .+ comprend aussi :$/)
			const comprendPas = line.match(/^Cette .+ ne comprend pas :$/)
			const produitsAssociés = line.match(/^Produits associés :\s+(.*)$/)

			const item = line.match(/^(•|-)\s+(.+)$/)

			// - CC : contenu central. Représente une part importante de l'activité de l’un ou de l’autre poste.
			// - CA : contenu annexe. Représente une part accessoire de l'activité des deux postes.
			// - NC : contenu exclu. Utile quand les deux postes sont identiques à une composante près facilement identifiée.
			//        Les ‘NC’ d’un lien correspondent généralement à des ‘CA’ de liens impliquant au moins l’un des deux postes concernés.

			const DEBUG_DATA = false as boolean

			const previousElement = arr[arr.length - 1]

			if (
				!section &&
				!division &&
				!groupe &&
				!classe &&
				!catégorie &&
				!sousCatégorie &&
				!sousClasse &&
				!contenuCentral &&
				!contenuAnnexe &&
				!contenuExclu &&
				!comprend &&
				!comprendAussi &&
				!comprendPas &&
				(!item || (item && !previous.contenuType))
			) {
				if (previous.index.section === null) {
					continue
				}

				previousElement.data.push(
					normalize(line),
					...(DEBUG_DATA === true ? [line] : [])
				)
			}

			if (
				!section &&
				!division &&
				!groupe &&
				!classe &&
				!catégorie &&
				!sousCatégorie &&
				!sousClasse &&
				!contenuCentral &&
				!contenuAnnexe &&
				!contenuExclu &&
				!comprend &&
				!comprendAussi &&
				!comprendPas &&
				!produitsAssociés &&
				!item &&
				previous.contenuType
			) {
				// @ts-ignore
				previousElement[previous.contenuType].push(
					normalize('# ' + line),
					...(DEBUG_DATA === true ? [line] : [])
				)
			} else if (!item) {
				previous.contenuType = null
			}

			if (item && previous.contenuType) {
				if (!(previous.contenuType in previousElement)) {
					throw new Error(
						`In page n°${pageIndex + 1}, no ${previous.contenuType} in ${
							previousElement.type
						}`
					)
				}
				// @ts-ignore
				previousElement[previous.contenuType].push(
					(item[1] === '•' ? '• ' : '') + normalize(item[2]),
					...(DEBUG_DATA === true ? [line] : [])
				)
			}

			if (comprend) {
				previous.contenuType = 'contenuCentral'
				continue
			}
			if (comprendAussi) {
				previous.contenuType = 'contenuAnnexe'
				continue
			}
			if (comprendPas) {
				previous.contenuType = 'contenuExclu'
				continue
			}

			const parseContenu = (
				type: 'contenuCentral' | 'contenuAnnexe' | 'contenuExclu',
				match: RegExpMatchArray | null,
				previousElement: Data,
				pageIndex: number
			) => {
				if (!match) {
					return false
				}
				if (!(type in previousElement)) {
					throw new Error(
						`In page n°${pageIndex + 1}, no ${type} in ${previousElement.type}`
					)
				}
				// @ts-ignore
				previousElement[type].push(
					normalize(match[2]),
					...(DEBUG_DATA === true ? [line] : [])
				)
				previous.contenuType = type

				return true
			}
			parseContenu('contenuCentral', contenuCentral, previousElement, pageIndex)
			parseContenu('contenuAnnexe', contenuAnnexe, previousElement, pageIndex)
			parseContenu('contenuExclu', contenuExclu, previousElement, pageIndex)

			const parseNomenclatures = (
				type: Data['type'],
				parentType: Data['type'] | null,
				match: RegExpMatchArray | null
			) => {
				if (!match) {
					return
				}

				if (parentType && previous.index[parentType] === null) {
					console.error('\n\n\n' + line)

					throw new Error(`no ${parentType} found`)
				}
				previous.index[type] = arr.length

				console.log(`[${type}]:`, match[1], '-', normalize(match[2]))

				const code = match[1]
				const {
					contenuCentral = [],
					contenuAnnexe = [],
					contenuExclu = [],
				} = CUSTOM[code] ?? {}

				arr.push({
					type,
					code,
					title: normalize(match[2]),
					data: [],
					contenuCentral,
					contenuAnnexe,
					contenuExclu,
					parent: (parentType && previous.index[parentType]) ?? undefined,
				})
			}
			parseNomenclatures('section', null, section)
			parseNomenclatures('division', 'section', division)
			parseNomenclatures('groupe', 'division', groupe)
			parseNomenclatures('classe', 'groupe', classe)
			parseNomenclatures('sousClasse', 'classe', sousClasse)
			parseNomenclatures('catégorie', 'sousClasse', catégorie)
			parseNomenclatures('sousCatégorie', 'catégorie', sousCatégorie)
		}

		return arr
	}, [] as Data[])
}

interface CommonData<Type extends string> {
	type: Type
	code: string
	title: string
	data: string[]
	contenuCentral: string[]
	contenuAnnexe: string[]
	contenuExclu: string[]
	parent?: number
}

type Section = CommonData<'section'>
type Division = CommonData<'division'>
type Groupe = CommonData<'groupe'>
type Classe = CommonData<'classe'>
type SousClasse = CommonData<'sousClasse'>
type Catégorie = CommonData<'catégorie'>
type SousCatégorie = CommonData<'sousCatégorie'>

type Data =
	| Section
	| Division
	| Groupe
	| Classe
	| SousClasse
	| Catégorie
	| SousCatégorie
