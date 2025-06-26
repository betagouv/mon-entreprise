import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'

import { PdfData, VerbosityLevel } from 'pdfdataextract'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const INPUT_PDF_PATH = join(
	__dirname,
	'./Nomenclatures_NAF_et_CPF_Reedition_2020.pdf'
)
const OUTPUT_JSON_PATH = join(__dirname, './output.json')
const OUTPUT_ORIGINAL_TEXT_PATH = join(__dirname, './output.txt')

const fileData = readFileSync(INPUT_PDF_PATH)

void PdfData.extract(fileData, {
	// how many pages should be read at most
	// pages: 6,
	// sort the text by text coordinates
	sort: true,
	// set the verbosity level for parsing
	verbosity: VerbosityLevel.ERRORS,
}).then(({ text }) => {
	writeFileSync(
		OUTPUT_ORIGINAL_TEXT_PATH,
		text?.join('\n\n[[[NEW PAGE]]]\n\n') ?? ''
	)
	writeFileSync(OUTPUT_JSON_PATH, JSON.stringify(transformText(text), null, 2))
})

const specialCase = new RegExp(
	[
		// remove space
		'fi lm',
		'fi nal',
		'coff re',
		'fl ottant',
		'gonfl able',
		'iff érent',
		'spécifi que',
		'infi rmeries',
		'artifi ciellement',

		// keep -
		'sports-|amateurs-',

		// remove \n and -
		'(divi)\\s*-\n(sions)',
		'(termi)\\s*-\n(naux)',
		'(enseigne)\\s*-\n(ment)',

		// remove space and \n
		'(est-)\\s*\n(à)',

		// remove \n
		'(de\\s+)\n(DVD)',
		'(en\\s+)\n(France)',
		'(DVD\\s+)\n(\\(cf.)',
		'(entre\\s+)\n(400)',
		'(niveau\\s*)\n(2)',
		'(groupe\\s*)\n(22.2.)',
		'(métier\\s+)\n(Rachel)',
		'(ciments\\s+)\n(Portland)',
		'(divisions\\s+)\n(05, 07 et 08)',

		// remove \n
		'(\\w+\\s+)\n(\\d+\\s+%)',
		'([a-zA-Z]+-)\n([a-z]+)',

		// remove space after -
		"([0-9a-z\u00E0-\u00FCA-Z\u00C0-\u00DC]{3,}-)\\s+([0-9a-z\u00E0-\u00FCA-Z\u00C0-\u00DC'Œ]{3,})",

		// remove \n after parentis open and close next line
		"(\\([0-9a-z\u00E0-\u00FCA-Z\u00C0-\u00DC'., -]+)\n([0-9a-z\u00E0-\u00FCA-Z\u00C0-\u00DC'., -]+\\))",
	].join('|'),
	'g'
)

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

	const data = pages.reduce((arr, page, pageIndex) => {
		const passPage = pageIndex === 0 || page.match(/Table des matières/)
		if (passPage) {
			return arr
		}

		const lines = page
			.replace(/\s+[21]{4,}/g, '')
			.replace(
				/([A-Z\u00C0-\u00DC()';]{2,}[\s;,-]+)\n([A-Z\u00C0-\u00DC()';]{2,})|([^A-Z])\s\n([^A-Z0-9\s•-])/g,
				'$1$3 $2$4'
			)
			.replace(
				/-\s+séchées,\s+cuites,\s+etc\.\)la/g,
				' séchées, cuites, etc.)\n- la'
			)
			.replace(
				specialCase,
				(removeSpace, ...rest) =>
					rest.slice(0, -2).join('') || removeSpace.replace(/\s+/, '')
			)
			.split('\n')

		for (let j = 0; j < lines.length; j++) {
			// eslint-disable-next-line no-console
			console.log('###', `>${lines[j]}<`)

			const line = lines[j].trim()
			const passLine = line.match(
				/Nomenclature d’Activités Française NAF|(Classification|Classifi cation) des Produits Française CPF/
			)
			if (line === '' || passLine) {
				// eslint-disable-next-line no-console
				console.log('[pass]')

				continue
			}

			const section = line.match(/^Section ([A-Z]) :\s+([^\n]+)$/)
			const division = line.match(/^(\d{2})\s+([A-Z\u00C0-\u00DC][^\n]+)$/)
			const groupe = line.match(/^(\d{2}\.\d)\s+([^\n]+)$/)
			const classe = line.match(/^(\d{2}\.\d{2})\s+([^\n]+)$/)
			const sousClasse = line.match(/^(\d{2}\.\d{2}[A-Z])\s+([^\n]+)$/)

			const catégorie = line.match(/^(\d{2}\.\d{2}\.\d)\s+([^\n]+)$/)
			const sousCatégorie = line.match(/^(\d{2}\.\d{2}\.\d{2})\s+([^\n]+)$/)

			const contenuCentral = line.match(/^(CC)\s+:[•-\s]*([^\n]+)$/)
			const contenuAnnexe = line.match(/^(CA)\s+:[•-\s]*([^\n]+)$/)
			const contenuExclu = line.match(/^(NC)\s+:[•-\s]*([^\n]+)$/)

			const comprend = line.match(
				/^(?:Ce|Cette)\s+[^\s]+\s+(?:comprend|couvre)\s+(?::|([^\n]+))$/
			)
			const comprendAussi = line.match(
				/^(?:Ce|Cette)\s+[^\s]+\s+(?:comprend|couvre)\s+aussi\s+(?::|([^\n]+))$/
			)
			const comprendPas = line.match(
				/^(?:Ce|Cette)\s+[^\s]+\s+ne\s+(?:comprend|couvre)\s+pas\s+(?::|([^\n]+))$/
			)
			const produitsAssociés = line.match(
				/^(?:Produits associés :\s+(.*)|[0-9p,. ]+)$/
			)

			const parExemple = line.match(/^Par exemple :$/)
			const item = line.match(/^(•|-|\d+\))\s+(.+)$/)

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
				!parExemple &&
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
				previousElement[previous.contenuType].push(
					normalize(line),
					...(DEBUG_DATA === true ? [line] : [])
				)
			} else if (!item && !produitsAssociés) {
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
				previousElement[previous.contenuType].push(
					(item[1] === '•' ? '• ' : '') + normalize(item[2]),
					...(DEBUG_DATA === true ? [line] : [])
				)
			}

			if (comprend && !comprendAussi && !comprendPas) {
				if (comprend[1]) {
					previousElement.contenuCentral.push(
						normalize(comprend[1]),
						...(DEBUG_DATA === true ? [comprend[1]] : [])
					)
				}
				previous.contenuType = 'contenuCentral'
				continue
			}
			if (comprendAussi) {
				if (comprendAussi[1]) {
					previousElement.contenuAnnexe.push(
						normalize(comprendAussi[1]),
						...(DEBUG_DATA === true ? [comprendAussi[1]] : [])
					)
				}
				previous.contenuType = 'contenuAnnexe'
				continue
			}
			if (comprendPas) {
				if (comprendPas[1]) {
					previousElement.contenuExclu.push(
						normalize(comprendPas[1]),
						...(DEBUG_DATA === true ? [comprendPas[1]] : [])
					)
				}
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
					// eslint-disable-next-line no-console
					console.error('\n\n\n' + line)

					throw new Error(`no ${parentType} found`)
				}
				previous.index[type] = arr.length

				// eslint-disable-next-line no-console
				console.log(`[${type}]:`, match[1], '-', normalize(match[2]))

				const code = match[1]

				arr.push({
					type,
					code,
					title: normalize(match[2]),
					data: [],
					contenuCentral: [],
					contenuAnnexe: [],
					contenuExclu: [],
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

	return data
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

export type Data =
	| Section
	| Division
	| Groupe
	| Classe
	| SousClasse
	| Catégorie
	| SousCatégorie
