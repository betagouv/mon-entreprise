import UFuzzy from '@leeoniya/ufuzzy'
import { useEffect, useRef, useState } from 'react'

import { TextField } from '@/design-system'
import { CardContainer } from '@/design-system/card/Card'
import { H3, H4 } from '@/design-system/typography/heading'
import { Ul } from '@/design-system/typography/list'
import { Body } from '@/design-system/typography/paragraphs'

import testData from './test.json'

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

const fuzzy = new UFuzzy({})

// interface Data {
// 	level_1: string
// 	level_2: string
// 	level_3: string
// 	level_4: string
// 	specific_word: string
// 	generic_word: string
// 	other_word: string
// 	excluded_word: string
// 	code: string
// 	code_ape_compatible: string
// }

// const witelist = {
// 	// CodeN1: '',
// 	"Niv. 1 \n(Domaine d'activité général)": 'level_1',
// 	// CodeN2: '',
// 	"Niv. 2\n(précision sur le domaine d'activité)": 'level_2',
// 	// CodeN3: '',
// 	"Niv. 3\n(précision du type d'exercice professionnel si besoin)": 'level_3',
// 	// CodeN4: '',
// 	'Niv. 4\n(précision détaillée du type de profession si besoin)': 'level_4',
// 	'MOT SPECIFIQUE': 'specific_word',
// 	'MOT GENERIQUE': 'generic_word',
// 	Autres: 'other_word',
// 	"mot d'exclusion": 'excluded_word',
// 	'Code final': 'code',
// 	// 'Affiliation si principale (hors prolongement agricole)': '',
// 	// 'Caisse de retraite spéciale': '',
// 	// 'Forme exercice Activité si  effectif < 11 (hors prolongement agricole)': '',
// 	// "Forme exercice d'activité si JQPA non revendiquée (hors proongement agricole)":
// 	// 	'',
// 	// 'Forme exercice Activité si prolongement agricole': '',
// 	// 'RESEAU ASSISTANCE': '',
// 	'Codes APE compatibles': 'code_ape_compatible',
// 	// 'déduction de precisionActivite': '',
// 	// 'si microEntreprise = true, déduction de regimeImpositionBenefices': '',
// 	// Affiliateur: '',
// 	// "Forme d'activité": '',
// 	// 'Encodage ACOSS': '',
// }

// const data = Untitled.map((obj) =>
// 	objectTransform(obj, (entries) =>
// 		entries
// 			.filter(([key]) => Object.keys(witelist).includes(key))
// 			.map(([key, val]) => [witelist[key as keyof typeof witelist], val])
// 			.map(([key, val]) =>
// 				key === 'code_ape_compatible'
// 					? [key, val.replace(/\s/g, '')]
// 					: [key, val]
// 			)
// 	)
// ) as unknown as Data[]

// console.log({ xxx: JSON.stringify(data, null, 2) })

const filteredData = (testData as Data[]).filter(
	({ type }) => type === 'sousClasse'
)

const { specificList, genericList, excludedList } = filteredData.reduce(
	(
		prev,
		{
			// generic_word: genericWord,
			// specific_word: specificWord,
			// excluded_word: excludedWord,
			// type,
			contenuCentral,
			contenuAnnexe,
			contenuExclu,
			title,
			code,
		}
	) => ({
		specificList: [
			...(prev.specificList ?? []),
			[title, ...contenuCentral, code].join(', '),
		],
		genericList: [...(prev.genericList ?? []), contenuAnnexe.join(', ')],
		excludedList: [...(prev.excludedList ?? []), contenuExclu.join(', ')],
	}),
	{} as {
		genericList: string[]
		specificList: string[]
		excludedList: string[]
	}
)

const latinizedSpecificList = UFuzzy.latinize(specificList)
const latinizedGenericList = UFuzzy.latinize(genericList)
const latinizedExcludedList = UFuzzy.latinize(excludedList)

export default function POCSearchCodeAPE() {
	const [value, setValue] = useState('')
	// const [list, setList] = useState<[number, ...string[]][]>([])
	const [list, setList] = useState<Data[]>([])

	const lastIdxs = useRef<Record<string, UFuzzy.HaystackIdxs>>({})
	const prevValue = useRef<string>(value)

	const highlight = (str: string, range: number[]) => [
		str.slice(0, range[0]),
		...range
			.map((a, i) =>
				range[i + 1] !== undefined ? ([a, range[i + 1]] as const) : null
			)
			.filter(<T,>(x: T | null): x is T => x != null)
			.map(([a, b]) => str.slice(a, b)),
		str.slice(range[range.length - 1]),
	]

	useEffect(() => {
		if (value.length) {
			console.time('bench')
			const latinizedValue = UFuzzy.latinize([value])[0]

			const search = (
				list: string[],
				value: string,
				cache?: UFuzzy.HaystackIdxs
			) => {
				const idxs = fuzzy.filter(list, value, cache)
				const info = fuzzy.info(idxs, list, value)
				const order = fuzzy.sort(info, list, value)

				return { idxs, info, order }
			}

			const specific = search(latinizedSpecificList, latinizedValue)
			const generic = search(latinizedGenericList, latinizedValue)
			const excluded = search(latinizedExcludedList, latinizedValue)

			// const customOrder = [...specific.info.idx, ...generic.info.idx].filter(
			// 	(id) => !excluded.info.idx.includes(id)
			// )
			const specificResults = specific.info.idx.map((id) => filteredData[id])
			const genericResults = generic.info.idx.map((id) => filteredData[id])
			const excludedResults = excluded.idxs.map((id) => filteredData[id])

			const results = [
				...new Set([...specificResults, ...genericResults]),
			].filter((result) => !excludedResults.includes(result))

			console.log({
				generic,
				specific,
				excluded,
				genericResults,
				specificResults,
				excludedResults,
				results,
			})

			console.timeEnd('bench')

			setList(results)
		} else {
			lastIdxs.current = {}
			setList([])
		}
		prevValue.current = value
	}, [value])

	return (
		<Body as="div">
			<TextField value={value} onChange={setValue} />
			<Ul style={{ height: '800px', overflow: 'auto' }}>
				{list.map(
					({ code, title, contenuCentral, contenuAnnexe, contenuExclu }) => {
						return (
							<CardContainer
								as="li"
								key={`${code}`}
								style={{
									overflow: 'auto',
									marginBottom: '1rem',
									alignItems: 'flex-start',
									height: 'initial',
								}}
							>
								<H3 style={{ marginTop: 0 }}>{title}</H3>
								<H4 style={{ marginTop: 0, color: 'grey' }}>
									Code : <span>{code}</span>
								</H4>
								<p style={{ marginTop: 0 }}>
									{contenuCentral.length ? (
										<>
											<span style={{ fontWeight: 'bold' }}>
												Contenu central de cette activité :
											</span>
											<br />
										</>
									) : null}
									{contenuCentral.map((contenu) => (
										<>
											{contenu}
											<br />
										</>
									))}
									{contenuAnnexe.length ? (
										<>
											<br />
											<span style={{ fontWeight: 'bold' }}>
												Contenu annexe de cette activité :
											</span>
											<br />
										</>
									) : null}
									{contenuAnnexe.map((contenu) => (
										<>
											{contenu}
											<br />
										</>
									))}
									{contenuExclu.length ? (
										<>
											<br />
											<span style={{ fontWeight: 'bold' }}>
												Contenu exclu de cette activité :
											</span>
											<br />
										</>
									) : null}
									{contenuExclu.map((contenu) => (
										<>
											{contenu}
											<br />
										</>
									))}
									{/* {elems.map((el, i) => {
										return i % 2 === 0 ? (
											el
										) : (
											<span style={{ color: 'red' }}>{el}</span>
										)
									})} */}
								</p>
								{/* <pre>{JSON.stringify(filteredData[index], null, 2)}</pre> */}
								{/* <pre>
									{JSON.stringify(
										{ code, contenuCentral, contenuAnnexe, contenuExclu },
										null,
										2
									)}
								</pre> */}
							</CardContainer>
						)
					}
				)}
			</Ul>
		</Body>
	)
}
