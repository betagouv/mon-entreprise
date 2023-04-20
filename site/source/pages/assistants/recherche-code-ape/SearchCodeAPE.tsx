import UFuzzy from '@leeoniya/ufuzzy'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { TrackPage } from '@/components/ATInternetTracking'
import FeedbackForm from '@/components/Feedback/FeedbackForm'
import { FromTop } from '@/components/ui/animate'
import {
	Message,
	PopoverWithTrigger,
	RadioCardGroup,
	SearchField,
} from '@/design-system'
import { Button } from '@/design-system/buttons'
import { Emoji } from '@/design-system/emoji'
import { StyledRadioSkeleton } from '@/design-system/field/Radio/RadioCard'
import { Grid, Spacing } from '@/design-system/layout'
import { SmallBody } from '@/design-system/typography/paragraphs'
import { useAsyncData } from '@/hooks/useAsyncData'

import { Result } from './Result'

type Data = typeof import('@/public/data/ape-search.json')

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
			const specificText = [
				title,
				...contenuCentral,
				codeApe,
				codeApe.replace('.', ''),
			].join('\t')
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
	const [selected, setSelected] = useState('')
	const [list, setList] = useState<ListResult[]>([])

	const lazyData = useAsyncData(() => import('@/public/data/ape-search.json'))

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
		 * Calcul le score final avec 2/3 * le score de la recherche + 1/3 * le score en fonction
		 * du nombre de création d'entreprise par code APE en 2021
		 */
		const computeScore = (scoreFuzzy: number, scoreNbEtablissement: number) =>
			(2 / 3) * scoreFuzzy + (1 / 3) * scoreNbEtablissement

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
				nbEtablissement:
					lazyData.indexByCodeApe[
						item.codeApe as keyof (typeof lazyData)['indexByCodeApe']
					] || 0,
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
	}, [buildedResearch, job, lazyData])

	type Alt = { match: string; proposal: string[] }
	const [alternative, setAlternative] = useState<Alt | null>(null)

	useEffect(() => {
		const alternatives: Alt[] = [
			{ match: 'vente', proposal: ['commerce'] },
			{ match: 'enseignant', proposal: ['enseignement', 'professeur'] },
			{ match: 'administratif', proposal: ['administration'] },
		]

		setAlternative(null)
		alternatives.forEach((alt) => {
			if (new RegExp(alt.match, 'i').test(job)) {
				setAlternative(alt)
			}
		})
	}, [job])

	const ret = (
		<Grid container>
			<Grid item lg={12} xl={11}>
				<SearchField
					value={job}
					onChange={setJob}
					label={t("Mots-clés définissants l'activité")}
					placeholder={t('Par exemple : coiffure, boulangerie ou restauration')}
				/>
				{alternative ? (
					<FromTop>
						<Message border={false} icon mini style={{ margin: '.5rem 0' }}>
							<SmallBody>
								<Trans i18nKey="search-code-ape.alternative" shouldUnescape>
									Vous pouvez essayer "
									{{ proposal: alternative.proposal.join('", "') }}" au lieu de
									"{{ match: alternative.match }}"
								</Trans>
							</SmallBody>
						</Message>
					</FromTop>
				) : (
					<Spacing xs />
				)}
				{list.length > 0 && (
					<FromTop>
						<TrackPage name="recherche" />
						<StyledRadioCardGroup
							value={selected}
							onChange={setSelected}
							isDisabled={disabled}
						>
							{list.slice(0, 25).map(({ item, debug }) => {
								return (
									<StyledRadioSkeleton
										isDisabled={disabled}
										value={item.codeApe}
										key={item.codeApe}
										visibleRadioAs="div"
									>
										<Result item={item} debug={debug} />
									</StyledRadioSkeleton>
								)
							})}
						</StyledRadioCardGroup>
					</FromTop>
				)}

				<Spacing md />
				<ActivityNotFound job={job} />
			</Grid>
		</Grid>
	)

	return ret
}

const StyledRadioCardGroup = styled(RadioCardGroup)`
	flex-direction: row;
	flex-wrap: wrap;
`

const ActivityNotFound = ({ job }: { job: string }) => {
	const [hide, setHide] = useState(false)
	const { t } = useTranslation()

	useEffect(() => {
		if (job.length > 0) {
			setHide(true)
		}
	}, [job.length])

	return (
		<>
			<PopoverWithTrigger
				trigger={(buttonProps) =>
					// eslint-disable-next-line react/jsx-props-no-spreading
					hide ? (
						<Button
							{...buttonProps}
							size="XS"
							color="tertiary"
							aria-haspopup="dialog"
							light
						>
							<Emoji emoji="🖐️" />{' '}
							<Trans i18nKey="search-code-ape.cant-find-my-activity">
								Je ne trouve pas mon activité
							</Trans>
						</Button>
					) : (
						<></>
					)
				}
				small
			>
				{() => (
					<>
						<FeedbackForm
							title={t('Quelle est votre activité ?')}
							infoSlot={
								<Message border={false} type="info" icon>
									<Trans i18nKey="search-code-ape.feedback.info">
										Nous ne sommes pas en mesure de répondre aux questions
										concernant le code APE de votre entreprise.
									</Trans>
								</Message>
							}
							description={
								<Trans i18nKey="search-code-ape.feedback.description">
									Décrivez-nous votre activité ainsi que les termes de recherche
									que vous avez utilisés qui n'ont pas donné de bons résultats.
									<br />
									Nous utiliserons ces informations pour améliorer cet outil.
								</Trans>
							}
							placeholder={t(
								`Bonjour, je suis boulanger et je n'ai pas trouvé en cherchant "pain" ou "viennoiserie".`
							)}
							tags={['code-ape']}
							hideShare
						/>
					</>
				)}
			</PopoverWithTrigger>
		</>
	)
}
