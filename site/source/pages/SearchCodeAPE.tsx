import UFuzzy from '@leeoniya/ufuzzy'
import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'

import { FromTop } from '@/components/ui/animate'
import { RadioCardGroup, TextField } from '@/design-system'
import { Button } from '@/design-system/buttons'
import { StyledRadioSkeleton } from '@/design-system/field/Radio/RadioCard'
import { Grid } from '@/design-system/layout'
import { H3 } from '@/design-system/typography/heading'
import { Body } from '@/design-system/typography/paragraphs'

import data from '../../../scripts/codeAPESearch/données-code-APE/output.min.json'
import { Output as Data } from '../../../scripts/codeAPESearch/données-code-APE/reduce-json'

const {
	apeData,
	indexByCodeApe,
	indexByCodeDepartement,
	nbEtablissements2021,
} = data as Data

interface SearchableData {
	original: string[]
	latinized: string[]
}

const buildResearch = () => {
	const fuzzy = new UFuzzy({ intraIns: 2 })

	const { specificList, genericList } = apeData.reduce(
		(prev, { contenuCentral, contenuAnnexe, title, codeApe }) => {
			const specificText = [title, ...contenuCentral, codeApe].join('\t')
			const genericText = contenuAnnexe.join('\t')

			return {
				specificList: {
					original: [...(prev.specificList?.original ?? []), specificText],
					latinized: [],
				},
				genericList: {
					original: [...(prev.genericList?.original ?? []), genericText],
					latinized: [],
				},
			}
		},
		{} as {
			genericList: SearchableData
			specificList: SearchableData
		}
	)

	specificList.latinized = UFuzzy.latinize(specificList.original)
	genericList.latinized = UFuzzy.latinize(genericList.original)

	return {
		fuzzy,
		specificList,
		genericList,
	}
}

const nbEtablissementParDepartement = (department: string, code: string) => {
	const index =
		indexByCodeApe[code] &&
		indexByCodeDepartement[department]?.find((i) =>
			indexByCodeApe[code].includes(i)
		)

	return typeof index === 'number'
		? nbEtablissements2021[index]
		: indexByCodeApe[code]?.reduce(
				(acc, index) => acc + nbEtablissements2021[index],
				0
		  ) ?? 0
}

interface ResultProps {
	debug: string | null
	item: {
		title: string
		codeApe: string
		contenuCentral: string[]
		contenuAnnexe: string[]
		contenuExclu: string[]
	}
	selected: string
}

const Result = ({ item, selected, debug }: ResultProps) => {
	const { title, codeApe, contenuCentral, contenuAnnexe, contenuExclu } = item
	const [open, setOpen] = useState(!false) // TODO remove !

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

interface ListResult {
	item: Data['apeData'][0]
	score: number
	debug: string | null
}

export default function SearchCodeAPE() {
	const [job, setJob] = useState('')
	const [department, setDepartment] = useState('')
	const [selected, setSelected] = useState('')
	const [list, setList] = useState<ListResult[]>([])

	const lastIdxs = useRef<Record<string, UFuzzy.HaystackIdxs>>({})
	const prevValue = useRef<string>(job)

	const { fuzzy, genericList, specificList } = useMemo(buildResearch, [])

	useEffect(() => {
		if (!job.length) {
			lastIdxs.current = {}
			setList([])
			prevValue.current = job

			return
		}

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
		const specificLatin = search(specificList.latinized, latinizedValue)
		const genericLatin = search(genericList.latinized, latinizedValue)

		/**
		 * Calcul le score final avec 3/4 * le score de la recherche + 1/4 * le score en fonction
		 * du nombre de création d'entreprise par code APE et departement en 2021
		 */
		const computeScore = (scoreFuzzy: number, scoreNbEtablissement: number) =>
			(3 / 4) * scoreFuzzy + (1 / 4) * scoreNbEtablissement

		const results = [
			...new Set([
				...specificLatin.order.map((i) => apeData[specificLatin.info.idx[i]]),
				...specific.order.map((i) => apeData[specific.info.idx[i]]),
				...genericLatin.order.map((i) => apeData[genericLatin.info.idx[i]]),
				...generic.order.map((i) => apeData[generic.info.idx[i]]),
			]),
		]
			.map((item, index, arr) => ({
				item,
				scoreFuzzy: index / arr.length,
				nbEtablissement: nbEtablissementParDepartement(
					department,
					item.codeApe.replace('.', '')
				),
			}))
			.sort(({ nbEtablissement: a }, { nbEtablissement: b }) => b - a)
			.map(({ item, scoreFuzzy, nbEtablissement }, index, arr) => {
				const score = computeScore(scoreFuzzy, index / arr.length)
				const debug = {
					score,
					scoreFuzzy,
					scoreNbEtablissement: index / arr.length,
					nbEtablissement,
				}

				return {
					item,
					score,
					debug: IS_DEVELOPMENT ? JSON.stringify(debug, null, 2) : null,
				}
			})
			.sort(({ score: a }, { score: b }) => a - b)

		setList(results)
		prevValue.current = job
	}, [department, job])

	const test = list.slice(0, 25).map(({ item, debug }) => {
		return (
			<StyledRadioSkeleton
				value={item.codeApe}
				key={item.codeApe}
				visibleRadioAs="div"
			>
				<Result
					{...{
						item,
						department,
						debug,
						selected,
					}}
				/>
			</StyledRadioSkeleton>
		)
	})

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
		</Body>
	)

	return ret
}

const StyledRadioCardGroup = styled(RadioCardGroup)`
	margin-top: 1rem;
	flex-direction: row;
	flex-wrap: wrap;
`
