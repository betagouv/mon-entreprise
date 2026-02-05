import { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { toAtString } from '@/components/ATInternetTracking'
import { useSearchParams } from '@/lib/navigation'
import PrivacyPolicy from '@/components/layout/Footer/PrivacyPolicy'
import { FromTop } from '@/components/ui/animate'
import useScrollToHash from '@/components/utils/Scroll/useScrollToHash'
import { Emoji, Grid, Spacing, Switch, typography } from '@/design-system'
import useSimulatorsData from '@/hooks/useSimulatorsData'
import { SimulatorDataValues } from '@/pages/simulateurs-et-assistants/metadata-src'
import PagesChart from '@/pages/statistiques/_components/PagesCharts'

import { MainIndicators } from './_components/LastMonthIndicators'
import { LastYearIndicator } from './_components/LastYearIndicator'
import SatisfactionChart from './_components/SatisfactionChart'
import {
	SelectedSimulator,
	SimulateursChoice,
} from './_components/SimulateursChoice'
import VisitChart from './_components/VisitChart'
import { Filter, PageChapter2, StatsStruct } from './types'
import { useStatistiques } from './useStatistiques'

const { headings, lists, paragraphs, Strong } = typography
const { H1, H2, H3 } = headings
const { Li, Ul } = lists
const { Body, Intro } = paragraphs

interface StatsDetailProps {
	stats: StatsStruct
}

export default function StatPage({ stats }: StatsDetailProps) {
	useScrollToHash()
	const [filter, setFilter] = useStatState()
	const [accessibleMode, setAccessibleMode] = useState(false)
	const {
		visitesJours,
		visitesMois,
		repartition,
		questionsRépondues,
		satisfaction,
	} = useStatistiques(stats, filter)
	const { t } = useTranslation()

	return (
		<>
			<Spacing md />
			<Grid container spacing={4} style={{ alignItems: 'flex-end' }}>
				<Grid item xs={12} md={7}>
					<Spacing xl />

					<H1>
						{t('pages.statistiques.h1', 'Statistiques')} <Emoji emoji="📊" />
					</H1>

					<Intro>
						{t(
							'pages.statistiques.intro',
							'Découvrez nos statistiques d’utilisation mises à jour quotidiennement.'
						)}
					</Intro>
					<Body>
						{t(
							'pages.statistiques.anonymous',
							'Les données recueillies sont anonymisées.'
						)}{' '}
						<PrivacyPolicy label={t('En savoir plus')} />
					</Body>
					<h2 className="sr-only">
						{t('pages.statistiques.h2.selection', 'Selection du simulateur')}
					</h2>
					<SimulateursChoice
						onChange={setFilter}
						value={filter}
						key={JSON.stringify(filter)}
					/>
				</Grid>
				<Grid item xs={12} md={5}>
					{filter && (
						<Grid container columns={4}>
							<FromTop key={JSON.stringify(filter)}>
								<SelectedSimulator filter={filter} />
							</FromTop>
						</Grid>
					)}
				</Grid>
			</Grid>
			<section>
				<MainIndicators
					questionsRépondues={questionsRépondues}
					satisfaction={satisfaction}
				/>
				<Trans i18nKey="pages.statistiques.explanation">
					<Ul>
						<Li>
							Les simulateurs et assistants de ce site ont pour but de{' '}
							<Strong>répondre à une question</Strong> (par exemple
							«&nbsp;combien mon entreprise doit-elle payer pour embaucher une
							personne&nbsp;?&nbsp;» ou «&nbsp;Quel est le meilleur statut
							juridique pour débuter mon activité&nbsp;?&nbsp;»)
						</Li>
						<Li>
							Pour calculer le nombre de questions répondues, nous multiplions
							le <Strong>nombre de simulations</Strong> par le{' '}
							<Strong>taux de satisfaction</Strong> moyen du simulateur.
						</Li>{' '}
					</Ul>
				</Trans>
			</section>
			<section id="visites-panel">
				<H2>
					{t('pages.statistiques.h2.evolution', 'Évolution sur plusieurs mois')}
				</H2>

				<Body>
					<Switch
						defaultSelected={accessibleMode}
						onChange={setAccessibleMode}
						/* Need this useless aria-label to silence a React-Aria warning */
						aria-label=""
					>
						{t(
							'pages.statistiques.a11y-switch',
							'Activer le mode accessibilité sur cette section'
						)}
					</Switch>
				</Body>
				<H3>{t('pages.statistiques.h3.visits', 'Visites')}</H3>
				<VisitChart
					visitesJours={visitesJours}
					visitesMois={visitesMois}
					accessibleMode={accessibleMode}
				/>

				{!!satisfaction.length &&
					// We only display the satisfaction chart if the last month's number of reviews is greater than 100
					(satisfaction.at(-2)?.total ?? 0) >= 100 && (
						<>
							<Spacing md />
							<H3>{t('pages.statistiques.h3.satisfaction', 'Satisfaction')}</H3>
							<SatisfactionChart
								data={satisfaction}
								accessibleMode={accessibleMode}
							/>
						</>
					)}
				{filter === '' && (
					<>
						<H3>
							{t(
								'pages.statistiques.h3.repartition',
								'Répartition des visites par simulateurs'
							)}
						</H3>

						<PagesChart data={repartition} accessibleMode={accessibleMode} />
					</>
				)}
			</section>
			<LastYearIndicator
				questionsRépondues={questionsRépondues}
				satisfaction={satisfaction}
				visitesMois={visitesMois}
			/>
		</>
	)
}

export function getFilter(s: SimulatorDataValues): Filter | '' {
	if ('iframePath' in s && s.iframePath === 'pamc') {
		return 'PAM'
	}
	if (!s.tracking) {
		return ''
	}
	const tracking = s.tracking as
		| string
		| { chapter2?: PageChapter2; chapter3?: string }

	const filter =
		typeof tracking === 'string' ? { chapter2: tracking } : tracking ?? ''
	if (!filter.chapter2) {
		return ''
	}

	return {
		chapter2: toAtString(filter.chapter2),
		...('chapter3' in filter && filter.chapter3
			? { chapter3: toAtString(filter.chapter3) }
			: {}),
	} as Filter
}

function useStatState() {
	const [searchParams, setSearchParams] = useSearchParams()

	const simulators = useSimulatorsData()
	const URLFilter: string = searchParams.get('module') ?? ''

	const [filter, setFilter] = useState<Filter | ''>(
		URLFilter in simulators
			? getFilter(simulators[URLFilter as keyof typeof simulators])
			: ['PAMC', 'api-rest'].includes(URLFilter)
			? (URLFilter as Filter)
			: ''
	)

	useEffect(() => {
		const module =
			Object.values(simulators).find(
				(s) =>
					!!filter && JSON.stringify(getFilter(s)) === JSON.stringify(filter)
			)?.id ?? filter
		const paramsEntries = [['module', module]].filter(
			([, val]) => val !== ''
		) as [string, string][]

		setSearchParams(paramsEntries, { replace: true })
	}, [filter, simulators, setSearchParams])

	return [filter, setFilter] as const
}
