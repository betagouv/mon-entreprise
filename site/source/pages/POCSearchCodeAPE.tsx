import UFuzzy from '@leeoniya/ufuzzy'
// import Fuse from 'fuse.js'
// import { fuzzyFilter, fuzzyMatch } from 'fuzzbunny'
// import fuzzysort from 'fuzzysort'
// import { matchSorter, rankings } from 'match-sorter'
// import MiniSearch from 'minisearch'
import { Fragment, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { FromTop } from '@/components/ui/animate'
import { RadioCardGroup, TextField } from '@/design-system'
import { Button } from '@/design-system/buttons'
import { StyledRadioSkeleton } from '@/design-system/field/Radio/RadioCard'
import { Grid } from '@/design-system/layout'
import { H3 } from '@/design-system/typography/heading'
import { Body } from '@/design-system/typography/paragraphs'

import data from '../../../converters/données-code-APE/output.min.json'
import { Output as Data } from '../../../converters/données-code-APE/reduce-json'

const {
	apeData,
	// sortByEffectif,
	indexByCodeApe,
	indexByCodeDepartement,
	nbEtablissements2021,
} = data as Data

// const normalize = (term: string) =>
// 	term.normalize('NFKD').replace(/[\u0300-\u036f]/g, '')

// const filteredData = apeData.map((el, id) => ({ ...el, id }))
// .map((obj) => ({
// 	...obj,
// 	title: obj.title,
// 	contenuCentral: fuzzysort.prepare(obj.contenuCentral.join('\n')),
// 	contenuAnnexe: fuzzysort.prepare(obj.contenuAnnexe.join('\n')),
// 	contenuExclu: fuzzysort.prepare(obj.contenuExclu.join('\n')),
// 	titleNorm: fuzzysort.prepare(normalize(obj.title)),
// 	contenuCentralNorm: fuzzysort.prepare(
// 		obj.contenuCentral.map((s) => normalize(s)).join('\n')
// 	),
// 	contenuAnnexeNorm: fuzzysort.prepare(
// 		obj.contenuAnnexe.map((s) => normalize(s)).join('\n')
// 	),
// 	contenuExcluNorm: fuzzysort.prepare(
// 		obj.contenuExclu.map((s) => normalize(s)).join('\n')
// 	),
// }))

// console.log(filteredData)

// const fuse = new Fuse(apeData, {
// 	keys: [
// 		// 'title',
// 		'contenuCentral',
// 		'contenuAnnexe',
// 		{
// 			name: 'contenuExclu',
// 			weight: 0.75,
// 		},
// 		// 'codeApe',
// 	],
// 	includeScore: true,
// 	includeMatches: true,
// 	findAllMatches: true,
// 	ignoreLocation: true,
// 	ignoreFieldNorm: true,
// 	minMatchCharLength: 3,
// 	threshold: 0.25,
// })

const fuzzy = new UFuzzy({
	intraIns: 2,
})

interface Xxxx {
	original: string[]
	latinized: string[]
}

const { specificList, genericList, excludedList } = apeData.reduce(
	(prev, { contenuCentral, contenuAnnexe, contenuExclu, title, codeApe }) => {
		const specificText = [title, ...contenuCentral, codeApe].join('\t')
		const genericText = contenuAnnexe.join('\t')
		const excludedText = contenuExclu.join('\t')

		return {
			specificList: {
				original: [...(prev.specificList?.original ?? []), specificText],
				latinized: [],
			},
			genericList: {
				original: [...(prev.genericList?.original ?? []), genericText],
				latinized: [],
			},
			excludedList: {
				original: [...(prev.excludedList?.original ?? []), excludedText],
				latinized: [],
			},
		}
	},
	{} as { genericList: Xxxx; specificList: Xxxx; excludedList: Xxxx }
)

specificList.latinized = UFuzzy.latinize(specificList.original)
genericList.latinized = UFuzzy.latinize(genericList.original)
excludedList.latinized = UFuzzy.latinize(excludedList.original)

const nbEtablissementParDepartement = (department: string, code: string) => {
	const index =
		indexByCodeApe[code] &&
		indexByCodeDepartement[department]?.find((i) =>
			indexByCodeApe[code].includes(i)
		)

	return typeof index === 'number' ? nbEtablissements2021[index] : -Infinity
}

// const stopWords = new Set([
// 	'a',
// 	'à',
// 	'cf',
// 	'de',
// 	'des',
// 	'elle',
// 	'elles',
// 	'en',
// 	'et',
// 	'etc',
// 	'il',
// 	'ils',
// 	'je',
// 	'l',
// 	'la',
// 	'le',
// 	'les',
// 	'nous',
// 	'on',
// 	'ont',
// 	'ou',
// 	'son',
// 	'sur',
// 	'tu',
// 	'vous',
// ])

// const miniSearch = new MiniSearch({
// 	fields: [
// 		'title',
// 		'contenuCentral',
// 		'contenuAnnexe',
// 		'contenuExclu',
// 		'codeApe',
// 	],
// 	searchOptions: {
// 		fuzzy: 0.3,
// 		boost: {
// 			// codeApe: 1.5,
// 			// title: 1.2,
// 			// contenuCentral: 1,
// 			// contenuAnnexe: 0.9,
// 			contenuExclu: 0.8,
// 		},
// 		prefix: true,
// 		// weights: 0.5,
// 	},

// 	processTerm: (term) => {
// 		const lower = term.toLowerCase()
// 		const normalize = term.normalize('NFKD').replace(/[^\w]/g, '')

// 		return stopWords.has(lower)
// 			? null
// 			: term !== normalize
// 			? [term, normalize]
// 			: term
// 	},
// })

// miniSearch.addAll(filteredData)

interface TestProps {
	debug?: string
	title: string
	codeApe: string
	selected: string
	contenuCentral: string[]
	contenuAnnexe: string[]
	contenuExclu: string[]
}

const Test = ({
	debug,
	title,
	codeApe,
	selected,
	contenuCentral,
	contenuAnnexe,
	contenuExclu,
}: TestProps): JSX.Element => {
	const [open, setOpen] = useState(!false)

	return (
		<Grid container style={{ alignItems: 'center' }}>
			<Grid item xs={12} md={10}>
				<H3 style={{ marginTop: 0, marginBottom: '.5rem' }}>{title}</H3>
				<p style={{ fontWeight: 'bold', marginTop: 0 }}>
					Code : <span>{codeApe}</span> - <br />
					[selected : <span>{selected}</span>]
				</p>
				{debug && <pre>{debug}</pre>}
			</Grid>

			<Grid item xs={12} md={2}>
				<Button size="XS" onClick={() => setOpen((x) => !x)}>
					En savoir plus
				</Button>
			</Grid>

			{open && (
				<FromTop>
					<Grid item xs={12}>
						<p style={{ marginTop: 0 }}>
							{contenuCentral.length ? (
								<>
									<span style={{ fontWeight: 'bold' }}>
										Contenu central de cette activité :
									</span>
									<br />
								</>
							) : null}
							{contenuCentral.map((contenu, i) => (
								<Fragment key={i}>
									{contenu}
									<br />
								</Fragment>
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
							{contenuAnnexe.map((contenu, i) => (
								<Fragment key={i}>
									{contenu}
									<br />
								</Fragment>
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
							{contenuExclu.map((contenu, i) => (
								<Fragment key={i}>
									{contenu}
									<br />
								</Fragment>
							))}
						</p>
					</Grid>
				</FromTop>
			)}
		</Grid>
	)
}

export default function POCSearchCodeAPE() {
	const [job, setJob] = useState('')
	const [department, setDepartment] = useState('')
	const [selected, setSelected] = useState('')
	const [list, setList] = useState<(Data['apeData'][0] & { debug?: string })[]>(
		[]
	)

	const lastIdxs = useRef<Record<string, UFuzzy.HaystackIdxs>>({})
	const prevValue = useRef<string>(job)

	useEffect(() => {
		if (job.length) {
			console.time('effect')
			// const latinizedValue = UFuzzy.latinize([value])[0]

			// const results = miniSearch.search(value, {
			// 	boostDocument(documentId, term) {
			// 		const codeApe = filteredData[documentId].codeApe.replace(/\./g, '')
			// 		const maxEffectif = nbEtablissements2021[sortByEffectif[0]]
			// 		const xxx = (indexByCodeApe[codeApe] ?? [])
			// 			.filter((index) => indexByCodeDepartement['44'].includes(index))
			// 			.map((index) => nbEtablissements2021[index])

			// 		if (xxx.length > 1) {
			// 			console.log(xxx)
			// 		}

			// 		const [yyy = 0] = xxx

			// 		console.log(codeApe, [
			// 			maxEffectif,
			// 			Object.keys(indexByCodeApe).sort(),
			// 			indexByCodeApe[codeApe],
			// 			indexByCodeDepartement['44'],
			// 			yyy,
			// 		])

			// 		const score = yyy / maxEffectif
			// 		filteredData[documentId].title =
			// 			filteredData[documentId].title.replace(/\s*[0-9.]+$/, '') +
			// 			' ' +
			// 			yyy.toString()

			// 		// return data.sortByEffectif[0]
			// 		return score
			// 	},
			// })

			/**
			 * score
			 * debut de mot
			 * faute possible
			 * accents
			 *
			 */

			// const results = matchSorter(apeData, job, {
			// 	keys: [
			// 		'codeApe',
			// 		'title',
			// 		'contenuCentral.*',
			// 		'contenuAnnexe.*',
			// 		'contenuExclu.*',
			// 	],
			// 	threshold: rankings.WORD_STARTS_WITH,
			// })
			// console.log(results)

			// const resultsBis = fuzzysort.go(job, filteredData, {
			// 	keys: [
			// 		'codeApe',
			// 		'title',
			// 		'titleNorm',
			// 		'contenuCentral',
			// 		'contenuCentralNorm',
			// 		'contenuAnnexe',
			// 		'contenuAnnexeNorm',
			// 		'contenuExclu',
			// 		'contenuExcluNorm',
			// 	],
			// 	limit: 50,

			// 	// Create a custom combined score to sort by. -100 to the desc score makes it a worse match
			// 	scoreFn: (a) => {
			// 		const [
			// 			scoreCodeApe,
			// 			scoreTitle,
			// 			scoreTitleNorm,
			// 			scoreContenuCentral,
			// 			scoreContenuCentralNorm,
			// 			scoreContenuAnnexe,
			// 			scoreContenuAnnexeNorm,
			// 			scoreContenuExclu,
			// 			scoreContenuExcluNorm,
			// 		] = a

			// 		const score = Math.max(
			// 			...[
			// 				scoreCodeApe,
			// 				scoreTitle,
			// 				scoreTitleNorm,
			// 				scoreContenuCentral,
			// 				scoreContenuCentralNorm,
			// 				scoreContenuAnnexe,
			// 				scoreContenuAnnexeNorm,
			// 			]
			// 				.map((obj) => obj?.score ?? null)
			// 				.filter((el) => el !== null)
			// 		)

			// 		const lowerScore =
			// 			Math.max(
			// 				...[scoreContenuExclu, scoreContenuExcluNorm]
			// 					.map((obj) => obj?.score ?? null)
			// 					.filter((el) => el !== null)
			// 			) * 2

			// 		// console.log(score, lowerScore)

			// 		return Math.max(lowerScore, score)
			// 	},
			// 	// 	Math.max(a[0] ? a[0].score : -1000, a[1] ? a[1].score - 100 : -1000),
			// })

			// console.log(
			// 	// results,
			// 	// miniSearch.autoSuggest(value, {
			// 	// 	// combineWith: 'AND',
			// 	// 	fuzzy: 0.3,
			// 	// 	prefix: true,
			// 	// 	//  (term, i, terms) => i === terms.length - 1,
			// 	// }),
			// 	resultsBis
			// )

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

			const latinizedValue = UFuzzy.latinize([job])[0]

			const specific = search(specificList.original, job)
			const generic = search(genericList.original, job)
			const excluded = search(excludedList.original, job)
			const specificLat = search(specificList.latinized, latinizedValue)
			const genericLat = search(genericList.latinized, latinizedValue)
			const excludedLat = search(excludedList.latinized, latinizedValue)

			// const mergeArr = <T,>(arr1: T[], arr2: T[]) => {
			// 	const len = Math.min(arr2.length, arr1.length)
			// 	const ret = []

			// 	for (let index = 0; index < len; index++) {
			// 		ret.push(arr1[index], arr2[index])
			// 	}
			// 	if (arr2.length !== arr1.length) {
			// 		ret.push(
			// 			...(arr2.length > arr1.length
			// 				? arr2.slice(arr1.length - arr2.length)
			// 				: arr1.slice(arr2.length - arr1.length))
			// 		)
			// 	}

			// 	return ret
			// }

			// const specificResults = []
			// 	.map(
			// 	(i, j) =>
			// 		apeData[
			// 			j < specific.order.length
			// 				? specific.info.idx[i]
			// 				: specificLat.info.idx[i]
			// 		]
			// )
			// const genericResults = []
			// .map(
			// 	(i, j) =>
			// 		apeData[
			// 			j < generic.order.length
			// 				? generic.info.idx[i]
			// 				: genericLat.info.idx[i]
			// 		]
			// )
			const excludedResults = [
				...excludedLat.order.map((i) => apeData[excludedLat.info.idx[i]]),
				...excluded.order.map((i) => apeData[excluded.info.idx[i]]),
			]
			// .map(
			// 	(i, j) =>
			// 		apeData[
			// 			j < excluded.order.length
			// 				? excluded.info.idx[i]
			// 				: excludedLat.info.idx[i]
			// 		]
			// )

			/**
			 * Calcul le score final avec 3/4 * le score de la recherche + 1/4 * le score en fonction
			 * du nombre de création d'entreprise par code APE et departement en 2021
			 */
			const computeScore = (scoreFuzzy: number, scoreNbEtablissement: number) =>
				(3 / 4) * scoreFuzzy + (1 / 4) * scoreNbEtablissement

			const resultsUFuzzy = [
				...new Set([
					...specificLat.order.map((i) => apeData[specificLat.info.idx[i]]),
					...specific.order.map((i) => apeData[specific.info.idx[i]]),
					...genericLat.order.map((i) => apeData[genericLat.info.idx[i]]),
					...generic.order.map((i) => apeData[generic.info.idx[i]]),
				]),
			]
				.filter((result) => !excludedResults.includes(result))
				.map((item, index, arr) => ({
					item,
					scoreFuzzy: index / arr.length,
					nbEtablissement: department
						? nbEtablissementParDepartement(
								department,
								item.codeApe.replace('.', '')
						  )
						: 0,
				}))
				.sort(({ nbEtablissement: a }, { nbEtablissement: b }) => b - a)
				.map(({ item, scoreFuzzy, nbEtablissement }, index, arr) => ({
					item,
					score: computeScore(scoreFuzzy, index / arr.length),
					debug: JSON.stringify(
						{
							score: computeScore(scoreFuzzy, index / arr.length),
							scoreFuzzy,
							scoreNbEtablissement: index / arr.length,
							nbEtablissement,
						},
						null,
						2
					),
				}))

				.sort(({ score: a }, { score: b }) => {
					// a.codeApe
					// b.codeApe
					// nbEtablissements2021[
					// ]

					// sortByEffectif[
					// ]

					// indexByCodeApe[a.codeApe]
					// const ppp =
					// 	indexByCodeApe[a.codeApe.replace('.', '')] &&
					// 	indexByCodeDepartement[department].filter((i) =>
					// 		indexByCodeApe[a.codeApe.replace('.', '')].includes(i)
					// 	)?.[0]
					// const fff =
					// 	indexByCodeApe[b.codeApe.replace('.', '')] &&
					// 	indexByCodeDepartement[department].filter((i) =>
					// 		indexByCodeApe[b.codeApe.replace('.', '')].includes(i)
					// 	)?.[0]

					// resultsUFuzzy

					// if (typeof ppp !== 'undefined') {
					// }
					// console.log('=>', a, b)

					return a - b

					// indexByCodeApe[b.codeApe]
				})
			// sortByEffectif,
			// indexByCodeApe,
			// indexByCodeDepartement,
			// nbEtablissements2021,

			console.log('resultsUFuzzy', resultsUFuzzy, {
				specificList,
				genericList,
				excludedList,
				specific,
				generic,
				excluded,
				specificLat,
				genericLat,
				excludedLat,
				specificResults: [
					...specificLat.order.map((i) => apeData[specificLat.info.idx[i]]),
					...specific.order.map((i) => apeData[specific.info.idx[i]]),
				],
				genericResults: [
					...genericLat.order.map((i) => apeData[genericLat.info.idx[i]]),
					...generic.order.map((i) => apeData[generic.info.idx[i]]),
				],
				excludedResults,
			})

			// const fuseResults = fuse.search(job)

			console.timeEnd('effect')

			setList(
				resultsUFuzzy.map(({ item, debug }) => ({
					...item,
					debug,
					// score: `${score}.
					// ${
					// 	''
					// 	// score !== undefined && nbEtablissements2021[score]
					// }`,
				}))
				// .map(({ id, score }) => {
				// 	// filteredData[id].title = filteredData[id].title + ' ' + score

				// 	return apeData[id]
				// })
				// resultsBis.map(({ obj }) => apeData[obj.id])
				// results
				// fuseResults.map((fuseResult) => fuseResult.item)
			)
		} else {
			lastIdxs.current = {}
			setList([])
		}
		prevValue.current = job
	}, [department, job])

	console.time('render')
	const test = list
		.slice(0, 25)
		.map(
			({
				codeApe,
				title,
				contenuCentral,
				contenuAnnexe,
				contenuExclu,
				debug,
			}) => {
				return (
					<StyledRadioSkeleton
						value={codeApe}
						key={codeApe}
						visibleRadioAs="div"
					>
						<Test
							{...{
								department,
								debug,
								title,
								codeApe,
								selected,
								contenuCentral,
								contenuAnnexe,
								contenuExclu,
							}}
						/>
					</StyledRadioSkeleton>
				)
			}
		)

	const ret = (
		<Body as="div">
			<Grid container>
				<Grid item xs={4}>
					<TextField
						value={department}
						onChange={setDepartment}
						label="Département"
					/>
				</Grid>
				<Grid item xs={8}>
					<TextField value={job} onChange={setJob} label="Votre métier" />
				</Grid>
			</Grid>

			<StyledRadioCardGroup value={selected} onChange={setSelected}>
				<Grid container>{test}</Grid>
			</StyledRadioCardGroup>

			{/* <Ul>
				{list
					.slice(0, 5)
					.map(
						({
							codeApe,
							title,
							contenuCentral,
							contenuAnnexe,
							contenuExclu,
						}) => {
							return (
								<StyledCardContainer as="li" key={`${codeApe}`}>
									{/* <Accordion>
									<Item
										title="Récupérer le formulaire complété sur «&nbsp;impot.gouv.fr&nbsp;»"
										key="impot.gouv.fr"
										hasChildItems={false}
									></Item>
								</Accordion> * /}

									<Grid item xs={12} md={10}>
										<H3 style={{ marginTop: 0, marginBottom: '.5rem' }}>
											{title}
										</H3>
										<p style={{ fontWeight: 'bold', marginTop: 0 }}>
											Code : <span>{codeApe}</span>
										</p>

										{/* <pre>{JSON.stringify(filteredData[index], null, 2)}</pre> * /}
										{/* <pre>
									{JSON.stringify(
										{ code, contenuCentral, contenuAnnexe, contenuExclu },
										null,
										2
									)}
								</pre> * /}
									</Grid>
									<Grid item xs={12} md={2}>
										En savoir plus
									</Grid>
									<Grid item xs={12}>
										<p style={{ marginTop: 0 }}>
											{contenuCentral.length ? (
												<>
													<span style={{ fontWeight: 'bold' }}>
														Contenu central de cette activité :
													</span>
													<br />
												</>
											) : null}
											{contenuCentral.map((contenu, i) => (
												<Fragment key={i}>
													{contenu}
													<br />
												</Fragment>
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
											{contenuAnnexe.map((contenu, i) => (
												<Fragment key={i}>
													{contenu}
													<br />
												</Fragment>
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
											{contenuExclu.map((contenu, i) => (
												<Fragment key={i}>
													{contenu}
													<br />
												</Fragment>
											))}
											{/* {elems.map((el, i) => {
										return i % 2 === 0 ? (
											el
										) : (
											<span style={{ color: 'red' }}>{el}</span>
										)
									})} * /}
										</p>
									</Grid>
								</StyledCardContainer>
							)
						}
					)}
			</Ul> */}
		</Body>
	)
	console.timeEnd('render')

	return ret
}

const StyledRadioCardGroup = styled(RadioCardGroup)`
	margin-top: 1rem;
	flex-direction: row;
	flex-wrap: wrap;
`

// const StyledCardContainer = styled(CardContainer)`
// 	height: initial;
// 	margin-bottom: 1rem;
// 	flex-direction: row;
// 	flex-wrap: wrap;
// `
