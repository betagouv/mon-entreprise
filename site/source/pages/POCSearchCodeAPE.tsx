import UFuzzy from '@leeoniya/ufuzzy'
import { useEffect, useRef, useState, Fragment } from 'react'

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

const fuzzy = new UFuzzy({
	intraIns: 2,
})

const filteredData = (testData as Data[]).filter(
	({ type }) => type === 'sousClasse'
)

const { specificList, genericList, excludedList } = filteredData.reduce(
	(prev, { contenuCentral, contenuAnnexe, contenuExclu, title, code }) => ({
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

			const specificResults = specific.order.map(
				(i) => filteredData[specific.info.idx[i]]
			)
			const genericResults = generic.order.map(
				(i) => filteredData[generic.info.idx[i]]
			)
			const excludedResults = excluded.order.map(
				(i) => filteredData[excluded.info.idx[i]]
			)

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
