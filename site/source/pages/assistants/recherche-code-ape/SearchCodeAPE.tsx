import UFuzzy from '@leeoniya/ufuzzy'
import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import FeedbackForm from '@/components/Feedback/FeedbackForm'
import { FromTop } from '@/components/ui/animate'
import {
	Chip,
	PopoverWithTrigger,
	RadioCardGroup,
	TextField,
} from '@/design-system'
import { Button } from '@/design-system/buttons'
import { Emoji } from '@/design-system/emoji'
import { StyledRadioSkeleton } from '@/design-system/field/Radio/RadioCard'
import { ChevronIcon } from '@/design-system/icons'
import { Grid, Spacing } from '@/design-system/layout'
import { H3 } from '@/design-system/typography/heading'
import { Body } from '@/design-system/typography/paragraphs'
import { useAsyncData } from '@/hooks/useAsyncData'

import { Output as Data } from '../../../../../scripts/codeAPESearch/données-code-APE/reduce-json'

interface SearchableData {
	original: string[]
	latinized: string[]
}

const buildResearch = (lazyData: Data | null) => {
	if (!lazyData) {
		return null
	}
	const { apeData } = lazyData

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

const nbEtablissementParDepartement = (
	data: Data,
	department: string,
	code: string
) => {
	const { indexByCodeApe, indexByCodeDepartement, nbEtablissements2021 } = data

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
}

const Result = ({ item, debug }: ResultProps) => {
	const { title, codeApe, contenuCentral, contenuAnnexe, contenuExclu } = item
	const [open, setOpen] = useState(false)
	const { t } = useTranslation()

	return (
		<Grid container style={{ alignItems: 'center' }}>
			<Grid item xs={12} sm={8} md={9} xl={10}>
				<H3 style={{ marginTop: 0, marginBottom: '.5rem' }}>
					{title}
					<Chip type="secondary">APE: {codeApe}</Chip>
				</H3>

				{debug && <pre>{debug}</pre>}
			</Grid>

			<StyledGrid item xs={12} sm={4} md={3} xl={2}>
				<Button size="XXS" light onPress={() => setOpen((x) => !x)}>
					{!open ? t('En savoir plus') : t('Replier')}{' '}
					<StyledChevron aria-hidden $isOpen={open} />
				</Button>
			</StyledGrid>

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
							{contenuCentral.length ? <br /> : null}

							{contenuAnnexe.length ? (
								<>
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
							{contenuAnnexe.length ? <br /> : null}

							{contenuExclu.length ? (
								<>
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

const StyledGrid = styled(Grid)`
	display: flex;
	justify-content: end;
`

const StyledChevron = styled(ChevronIcon)<{ $isOpen: boolean }>`
	vertical-align: middle;
	transform: rotate(-90deg);
	transition: transform 0.3s;
	${({ $isOpen }) =>
		!$isOpen &&
		css`
			transform: rotate(90deg);
		`}
`

interface ListResult {
	item: Data['apeData'][0]
	score: number
	debug: string | null
}

interface SearchCodeApeProps {
	disabled?: boolean
}

export default function SearchCodeAPE({ disabled }: SearchCodeApeProps) {
	const { t } = useTranslation()
	const [job, setJob] = useState('')
	const [department, setDepartment] = useState('')
	const [selected, setSelected] = useState('')
	const [list, setList] = useState<ListResult[]>([])

	const lazyData = useAsyncData(
		() =>
			import(
				'../../../../../scripts/codeAPESearch/données-code-APE/output.min.json'
			)
	)

	const lastIdxs = useRef<Record<string, UFuzzy.HaystackIdxs>>({})
	const prevValue = useRef<string>(job)

	const buildedResearch = useMemo(() => buildResearch(lazyData), [lazyData])

	useEffect(() => {
		if (!lazyData || !buildedResearch) {
			return
		}
		const { apeData } = lazyData
		const { fuzzy, genericList, specificList } = buildedResearch

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
					lazyData,
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
	}, [buildedResearch, department, job, lazyData])

	const ret = (
		<Body as="div">
			<Grid container>
				<Grid item xs={4}>
					<TextField
						value={department}
						onChange={setDepartment}
						label={t('Département')}
					/>
				</Grid>
				<Grid item xs={8}>
					<TextField
						value={job}
						onChange={setJob}
						label={t('Votre activité')}
					/>
				</Grid>
			</Grid>

			{IS_DEVELOPMENT && (
				<>
					[selected: <span>{disabled ? 'disabled' : selected || 'none'}</span>]
				</>
			)}

			<StyledRadioCardGroup
				value={selected}
				onChange={setSelected}
				isDisabled={disabled}
			>
				<Grid container>
					{list.slice(0, 25).map(({ item, debug }) => {
						return (
							<StyledRadioSkeleton
								value={item.codeApe}
								key={item.codeApe}
								visibleRadioAs="div"
							>
								<Result item={item} debug={debug} />
							</StyledRadioSkeleton>
						)
					})}
				</Grid>
			</StyledRadioCardGroup>

			<Spacing sm />
			<ActivityNotFound />
		</Body>
	)

	return ret
}

const StyledRadioCardGroup = styled(RadioCardGroup)`
	margin-top: 1rem;
	flex-direction: row;
	flex-wrap: wrap;
`

const ActivityNotFound = () => {
	const { t } = useTranslation()

	return (
		<>
			<PopoverWithTrigger
				trigger={(buttonProps) => (
					// eslint-disable-next-line react/jsx-props-no-spreading
					<Button {...buttonProps} size="XS" color="tertiary" light>
						<Emoji emoji="🖐️" />{' '}
						<Trans i18nKey="search-code-ape.cant-find-my-activity">
							Je ne trouve pas mon activité
						</Trans>
					</Button>
				)}
				small
			>
				{() => (
					<>
						<FeedbackForm
							title={t('Quelle est votre activité ?')}
							description={t(
								"Décrivez-nous votre activité ainsi que les termes de recherche que vous avez utilisés qui n'ont pas donné de bons résultats"
							)}
							placeholder={t(
								`Bonjour, je suis boulanger et je n'ai pas trouvé en cherchant "pain" ou "viennoiserie".`
							)}
							tags={['code-ape']}
						/>
					</>
				)}
			</PopoverWithTrigger>
		</>
	)
}
