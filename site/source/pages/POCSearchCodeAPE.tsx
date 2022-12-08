import UFuzzy from '@leeoniya/ufuzzy'
import { Fragment, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { FromTop } from '@/components/ui/animate'
import { RadioCardGroup, TextField } from '@/design-system'
import { Button } from '@/design-system/buttons'
import { CardContainer } from '@/design-system/card/Card'
import { StyledRadioSkeleton } from '@/design-system/field/Radio/RadioCard'
import { Grid } from '@/design-system/layout'
import { H3 } from '@/design-system/typography/heading'
import { Ul } from '@/design-system/typography/list'
import { Body } from '@/design-system/typography/paragraphs'

import data from '../../../converters/données-code-APE/output.min.json'
import { Output as Data } from '../../../converters/données-code-APE/reduce-json'

const fuzzy = new UFuzzy({
	intraIns: 2,
})

const filteredData = (data as Data).apeData

const { specificList, genericList, excludedList } = filteredData.reduce(
	(prev, { contenuCentral, contenuAnnexe, contenuExclu, title, codeApe }) => ({
		specificList: [
			...(prev.specificList ?? []),
			[title, ...contenuCentral, codeApe].join(', '),
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

const Test = ({
	title,
	codeApe,
	selected,
	contenuCentral,
	contenuAnnexe,
	contenuExclu,
}) => {
	const [open, setOpen] = useState(false)

	return (
		<Grid container style={{ alignItems: 'center' }}>
			<Grid item xs={12} md={10}>
				<H3 style={{ marginTop: 0, marginBottom: '.5rem' }}>{title}</H3>
				<p style={{ fontWeight: 'bold', marginTop: 0 }}>
					Code : <span>{codeApe}</span>
					<br />
					[selected : <span>{selected}</span>]
				</p>
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
	const [value, setValue] = useState('')
	const [selected, setSelected] = useState('')
	// const [list, setList] = useState<[number, ...string[]][]>([])
	const [list, setList] = useState<Data['apeData']>([])

	const lastIdxs = useRef<Record<string, UFuzzy.HaystackIdxs>>({})
	const prevValue = useRef<string>(value)

	useEffect(() => {
		if (value.length) {
			console.time('effect')
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

			console.timeEnd('effect')

			setList(results)
		} else {
			lastIdxs.current = {}
			setList([])
		}
		prevValue.current = value
	}, [value])

	console.time('render')
	const test = list
		.slice(0, 25)
		.map(({ codeApe, title, contenuCentral, contenuAnnexe, contenuExclu }) => {
			return (
				<StyledRadioSkeleton value={codeApe} key={codeApe} visibleRadioAs="div">
					<Test
						{...{
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
		})

	const ret = (
		<Body as="div">
			<TextField value={value} onChange={setValue} />

			<StyledRadioCardGroup value={selected} onChange={setSelected}>
				<Grid container>{test}</Grid>
			</StyledRadioCardGroup>

			<Ul>
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
								</Accordion> */}

									<Grid item xs={12} md={10}>
										<H3 style={{ marginTop: 0, marginBottom: '.5rem' }}>
											{title}
										</H3>
										<p style={{ fontWeight: 'bold', marginTop: 0 }}>
											Code : <span>{codeApe}</span>
										</p>

										{/* <pre>{JSON.stringify(filteredData[index], null, 2)}</pre> */}
										{/* <pre>
									{JSON.stringify(
										{ code, contenuCentral, contenuAnnexe, contenuExclu },
										null,
										2
									)}
								</pre> */}
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
									})} */}
										</p>
									</Grid>
								</StyledCardContainer>
							)
						}
					)}
			</Ul>
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

const StyledCardContainer = styled(CardContainer)`
	height: initial;
	margin-bottom: 1rem;
	flex-direction: row;
	flex-wrap: wrap;
`
