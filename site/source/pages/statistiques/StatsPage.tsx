import { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'

import { toAtString } from '@/components/ATInternetTracking'
import PrivacyPolicy from '@/components/layout/Footer/PrivacyPolicy'
import { FromTop } from '@/components/ui/animate'
import { useScrollToHash } from '@/components/utils/markdown'
import { Emoji } from '@/design-system/emoji'
import { Grid, Spacing } from '@/design-system/layout'
import { Switch } from '@/design-system/switch'
import { Strong } from '@/design-system/typography'
import { H1, H2, H3 } from '@/design-system/typography/heading'
import { Li, Ul } from '@/design-system/typography/list'
import { Body, Intro } from '@/design-system/typography/paragraphs'
import useSimulatorsData, { SimulatorData } from '@/hooks/useSimulatorsData'
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
						Statistiques <Emoji emoji="📊" />
					</H1>

					<Intro>
						Découvrez nos statistiques d'utilisation mises à jour
						quotidiennement.
					</Intro>
					<Body>
						Les données recueillies sont anonymisées.{' '}
						<PrivacyPolicy label={t('En savoir plus')} />
					</Body>
					<h2 className="sr-only">Selection du simulateur</h2>
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
				<Trans>
					<Ul>
						<Li>
							Les simulateurs et assistants de ce site ont pour but de{' '}
							<Strong>répondre à une question</Strong> (par exemple « combien
							mon entreprise doit-elle payer pour embaucher une personne ? » ou
							« Quel est le meilleur statut juridique pour débuter mon activité
							? »
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
				<H2>Évolution sur plusieurs mois</H2>

				<Body>
					<Switch defaultSelected={accessibleMode} onChange={setAccessibleMode}>
						Activer le mode accessibilité sur cette section
					</Switch>
				</Body>
				<H3>Visites</H3>
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
							<H3>Satisfaction</H3>
							<SatisfactionChart
								data={satisfaction}
								accessibleMode={accessibleMode}
							/>
						</>
					)}
				{filter === '' && (
					<>
						<H3>Répartition des visites par simulateurs</H3>

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

export function getFilter(s: SimulatorData[keyof SimulatorData]): Filter | '' {
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
