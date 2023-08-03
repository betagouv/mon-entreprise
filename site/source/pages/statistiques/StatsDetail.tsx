import { formatValue } from 'publicodes'
import { useCallback, useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { BrushProps } from 'recharts'
import styled from 'styled-components'

import { toAtString } from '@/components/ATInternetTracking'
import PagesChart from '@/components/charts/PagesCharts'
import { useScrollToHash } from '@/components/utils/markdown'
import { Message, Radio, ToggleGroup } from '@/design-system'
import InfoBulle from '@/design-system/InfoBulle'
import { Grid, Spacing } from '@/design-system/layout'
import { H2, H3 } from '@/design-system/typography/heading'
import { Body } from '@/design-system/typography/paragraphs'
import useSimulatorsData, { SimulatorData } from '@/hooks/useSimulatorsData'
import { debounce } from '@/utils'

import { AccessibleTable } from './AccessibleTable'
import Chart, { formatLegend } from './Chart'
import SatisfactionChart from './SatisfactionChart'
import { SelectedSimulator, SimulateursChoice } from './SimulateursChoice'
import { BigIndicator } from './StatsGlobal'
import { PageChapter2, StatsStruct } from './types'
import { Filter, useStatistiques } from './useStatistiques'
import { useTotals } from './useTotals'
import { formatDay, formatMonth } from './utils'

type Period = 'mois' | 'jours'

interface StatsDetailProps {
	stats: StatsStruct
	accessibleMode: boolean
}

export const StatsDetail = ({ stats, accessibleMode }: StatsDetailProps) => {
	useScrollToHash()
	const [{ period, filter }, { setPeriod, setFilter }] = useStatState()

	const { t } = useTranslation()
	const { visites, repartition, satisfaction } = useStatistiques({
		period,
		stats,
		filter,
	})

	const [[startDateIndex, endDateIndex], setDateIndex] = useState<
		[startIndex: number, endIndex: number]
	>([0, visites.length - 1])

	useEffect(() => {
		setDateIndex([0, visites.length - 1])
	}, [visites.length])

	const [slicedVisits, setSlicedVisits] = useState(visites)
	useEffect(() => {
		setSlicedVisits(visites)
	}, [visites])

	const totals = useTotals(slicedVisits)

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const handleDateChange = useCallback(
		debounce(1000, ({ startIndex, endIndex }) => {
			if (startIndex != null && endIndex != null) {
				setDateIndex([startIndex, endIndex])
				setSlicedVisits(visites.slice(startIndex, endIndex + 1))
			}
		}) as NonNullable<BrushProps['onChange']>,
		[visites]
	)

	type ApiData = {
		date: string
		nombre: { evaluate: number; rules: number; rule: number }
	}
	const apiCumul =
		filter === 'api-rest' &&
		slicedVisits.length > 0 &&
		typeof slicedVisits[0]?.nombre === 'object' &&
		(slicedVisits as ApiData[]).reduce(
			(acc, { nombre }) => ({
				evaluate: acc.evaluate + nombre.evaluate,
				rules: acc.rules + nombre.rules,
				rule: acc.rule + nombre.rule,
			}),
			{ evaluate: 0, rules: 0, rule: 0 }
		)

	return (
		<>
			<H2>Statistiques détaillées</H2>

			<Indicators>
				<div
					css={`
						flex-basis: 50%;
					`}
				>
					<SimulateursChoice onChange={setFilter} value={filter} />
					<Spacing sm />
					<Grid container columns={4}>
						{filter && <SelectedSimulator filter={filter} />}
					</Grid>
				</div>
				<div>
					<StyledBody id="mode-affichage-label">
						<Trans>Afficher les données par :</Trans>
					</StyledBody>
					<ToggleGroup
						onChange={(val) => setPeriod(val as Period)}
						defaultValue={period}
						aria-labelledby="mode-affichage-label"
						aria-controls="visites-panel"
					>
						<Radio value="jours">
							<Trans>Jours</Trans>
						</Radio>
						<Radio value="mois">
							<Trans>Mois</Trans>
						</Radio>
					</ToggleGroup>
					<Spacing sm />
				</div>
			</Indicators>

			<div id="visites-panel">
				<H3>Visites</H3>

				{visites.length ? (
					accessibleMode ? (
						<AccessibleTable
							period={period}
							data={visites.map(({ date, nombre }) => ({
								date,
								nombre:
									typeof nombre === 'number' ? { visites: nombre } : nombre,
							}))}
							formatKey={(key) =>
								key === 'visites' ? t('Nombre de visites') : formatLegend(key)
							}
							caption={
								<Trans>
									Tableau indiquant le nombre de visites sur le site
									mon-entreprise par{' '}
									{{ period: period === 'jours' ? t('jours') : t('mois') }}.
								</Trans>
							}
						/>
					) : (
						<Chart
							key={period + visites.length.toString()}
							period={period}
							data={visites}
							onDateChange={handleDateChange}
							startIndex={startDateIndex}
							endIndex={endDateIndex}
						/>
					)
				) : (
					<Message type="info">Aucune donnée disponible.</Message>
				)}
			</div>

			{slicedVisits.length > 0 && (
				<H3>
					Cumuls pour la période{' '}
					{period === 'jours'
						? `du ${formatDay(slicedVisits[0].date)} au ${formatDay(
								slicedVisits[slicedVisits.length - 1].date
						  )}`
						: `de ${formatMonth(slicedVisits[0].date)}` +
						  (slicedVisits.length > 1
								? ` à ${formatMonth(
										slicedVisits[slicedVisits.length - 1].date
								  )}`
								: '')}
				</H3>
			)}

			<Grid container spacing={2}>
				{apiCumul ? (
					<>
						<BigIndicator
							main={apiCumul.evaluate}
							subTitle="Appel à /evaluate"
						/>
						<BigIndicator main={apiCumul.rules} subTitle="Appel à /rules" />
						<BigIndicator main={apiCumul.rule} subTitle="Appel à /rule/*" />
					</>
				) : (
					<BigIndicator
						main={formatValue(
							typeof totals === 'number' ? totals : totals.accueil
						)}
						subTitle="Visites"
					/>
				)}

				{typeof totals !== 'number' && 'simulation_commencee' in totals && (
					<>
						{' '}
						<BigIndicator
							main={formatValue(totals.simulation_commencee)}
							subTitle="Simulations "
						/>
						<BigIndicator
							main={formatValue(
								Math.round(
									(100 * totals.simulation_commencee) / totals.accueil
								),
								{ displayedUnit: '%' }
							)}
							subTitle={
								<>
									Taux de conversion&nbsp;
									<InfoBulle>
										Pourcentage de personne qui commencent une simulation
									</InfoBulle>
								</>
							}
						/>
					</>
				)}
			</Grid>

			{period === 'mois' && !!satisfaction.length && (
				<>
					<H3>Satisfaction</H3>
					<SatisfactionChart
						key={JSON.stringify(filter)}
						data={satisfaction}
						accessibleMode={accessibleMode}
					/>
				</>
			)}

			{filter === '' && period === 'mois' && (
				<>
					<H2>Simulateurs principaux</H2>
					<PagesChart data={repartition} accessibleMode={accessibleMode} />
				</>
			)}
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

const Indicators = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	gap: 12px;

	@media (min-width: ${({ theme }) => theme.breakpointsWidth.sm}) {
		flex-direction: row;
		align-items: flex-end;
	}
`

const StyledBody = styled(Body)`
	margin-bottom: 0.25rem;
`

const DEFAULT_PERIOD = 'mois'
function useStatState() {
	const [searchParams, setSearchParams] = useSearchParams()

	const [period, setPeriod] = useState<Period>(
		(searchParams.get('periode') as Period) ?? DEFAULT_PERIOD
	)
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
		const paramsEntries = [
			['periode', period !== DEFAULT_PERIOD ? period : ''],
			['module', module],
		].filter(([, val]) => val !== '') as [string, string][]

		setSearchParams(paramsEntries, { replace: true })
	}, [period, filter, simulators, setSearchParams])

	return [
		{
			period,
			filter,
		},
		{
			setPeriod,
			setFilter,
		},
	] as const
}
