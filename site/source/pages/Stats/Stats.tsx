import PagesChart from '@/components/charts/PagesCharts'
import InfoBulle from '@/components/ui/InfoBulle'
import Emoji from '@/components/utils/Emoji'
import { useScrollToHash } from '@/components/utils/markdown'
import { Radio, ToggleGroup } from '@/design-system/field'
import { Item, Select } from '@/design-system/field/Select'
import { Grid, Spacing } from '@/design-system/layout'
import { H2, H3 } from '@/design-system/typography/heading'
import { Body, Intro } from '@/design-system/typography/paragraphs'
import { useFetchData } from '@/hooks/useFetchData'
import { formatValue } from 'publicodes'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Trans } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { BrushProps } from 'recharts'
import styled from 'styled-components'
import { toAtString } from '../../ATInternetTracking'
import { debounce, groupBy } from '../../utils'
import { SimulateurCard } from '../Simulateurs/Home'
import useSimulatorsData, { SimulatorData } from '../Simulateurs/metadata'
import Chart, { Data, isDataStacked } from './Chart'
import DemandeUtilisateurs from './DemandesUtilisateurs'
import GlobalStats, { BigIndicator } from './GlobalStats'
import SatisfactionChart from './SatisfactionChart'
import { Page, PageChapter2, PageSatisfaction, StatsStruct } from './types'
import { formatDay, formatMonth } from './utils'

type Period = 'mois' | 'jours'
type Chapter2 = PageChapter2 | 'PAM'

type Pageish = Page | PageSatisfaction

const isPAM = (name: string | undefined) =>
	name &&
	[
		'medecin',
		'chirurgien_dentiste',
		'auxiliaire_medical',
		'sage_femme',
	].includes(name)

const filterByChapter2 = (pages: Pageish[], chapter2: Chapter2 | '') => {
	return Object.entries(
		groupBy(
			pages.filter(
				(p) =>
					!chapter2 ||
					((!('page' in p) || p.page !== 'accueil_pamc') &&
						(p.page_chapter2 === chapter2 ||
							(chapter2 === 'PAM' && isPAM(p.page_chapter3))))
			),
			(p) => ('date' in p ? p.date : p.month)
		)
	).map(([date, values]) => ({
		date,
		nombre: Object.fromEntries(
			Object.entries(
				groupBy(values, (x) => ('page' in x ? x.page : x.click))
			).map(([key, values]) => [
				key,
				values.reduce((sum, value) => sum + value.nombre, 0),
			])
		),
	}))
}

function groupByDate(data: Pageish[]) {
	return Object.entries(
		groupBy(
			data.filter((d) => 'page' in d && d.page === 'accueil'),
			(p) => ('date' in p ? p.date : p.month)
		)
	).map(([date, values]) => ({
		date,
		nombre: Object.fromEntries(
			Object.entries(
				groupBy(values, (x) => x.page_chapter1 + ' / ' + x.page_chapter2)
			)
				.map(
					([k, v]) =>
						[k, v.map((v) => v.nombre).reduce((a, b) => a + b, 0)] as const
				)
				.sort((a, b) => b[1] - a[1])
				.slice(0, 7)
		),
	}))
}

const computeTotals = (
	data: Data<number> | Data<Record<string, number>>
): number | Record<string, number> => {
	return isDataStacked(data)
		? data
				.map((d) => d.nombre)
				.reduce(
					(acc, record) =>
						[...Object.entries(acc), ...Object.entries(record)].reduce(
							(merge, [key, value]) => {
								return { ...merge, [key]: (acc[key] ?? 0) + value }
							},
							{}
						),
					{}
				)
		: data.map((d) => d.nombre).reduce((a, b) => a + b, 0)
}

interface BrushStartEndIndex {
	startIndex?: number
	endIndex?: number
}

interface StatsDetailProps {
	stats: StatsStruct
}

const StatsDetail = ({ stats }: StatsDetailProps) => {
	const defaultPeriod = 'mois'
	const [searchParams, setSearchParams] = useSearchParams()
	useScrollToHash()

	const [period, setPeriod] = useState<Period>(
		(searchParams.get('periode') as Period) ?? defaultPeriod
	)
	const [chapter2, setChapter2] = useState<Chapter2 | ''>(
		(searchParams.get('module') as Chapter2) ?? ''
	)

	useEffect(() => {
		const paramsEntries = [
			['periode', period !== defaultPeriod ? period : ''],
			['module', chapter2],
		].filter(([, val]) => val !== '') as [string, string][]

		setSearchParams(paramsEntries, { replace: true })
	}, [period, chapter2, setSearchParams])

	const visites = useMemo(() => {
		const rawData = period === 'jours' ? stats.visitesJours : stats.visitesMois
		if (!chapter2) {
			return rawData.site
		}

		return filterByChapter2(rawData.pages as Pageish[], chapter2)
	}, [period, chapter2])

	const repartition = useMemo(() => {
		const rawData = stats.visitesMois

		return groupByDate(rawData.pages as Pageish[])
	}, [])

	const satisfaction = useMemo(() => {
		return filterByChapter2(stats.satisfaction as Pageish[], chapter2)
	}, [chapter2])

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

	const totals: number | Record<string, number> = useMemo(
		() => computeTotals(slicedVisits),
		[slicedVisits]
	)

	const chapters2: Chapter2[] = [
		...new Set(stats.visitesMois?.pages.map((p) => p.page_chapter2)),
		'PAM',
	]

	return (
		<>
			<H2>Statistiques détaillées</H2>
			<Indicators>
				<div
					css={`
						flex-basis: 50%;
					`}
				>
					<SimulateursChoice
						onChange={setChapter2}
						value={chapter2}
						possibleValues={chapters2}
					/>
					<Spacing sm />
					<Grid container columns={4}>
						<SelectedSimulator chapter2={chapter2} />
					</Grid>
				</div>
				<div>
					<ToggleGroup
						onChange={(val) => setPeriod(val as Period)}
						defaultValue={period}
					>
						<Radio value="jours">
							<Trans>jours</Trans>
						</Radio>
						<Radio value="mois">
							<Trans>mois</Trans>
						</Radio>
					</ToggleGroup>
				</div>
			</Indicators>

			<H3>Visites</H3>

			<Chart
				key={period + visites.length.toString()}
				period={period}
				data={visites}
				onDateChange={handleDateChange}
				startIndex={startDateIndex}
				endIndex={endDateIndex}
			/>

			<H3>
				Cumuls pour la période{' '}
				{period === 'jours'
					? `du ${formatDay(slicedVisits[0].date)} au ${formatDay(
							slicedVisits[slicedVisits.length - 1].date
					  )}`
					: `de ${formatMonth(slicedVisits[0].date)}` +
					  (slicedVisits.length > 1
							? ` à ${formatMonth(slicedVisits[slicedVisits.length - 1].date)}`
							: '')}
			</H3>

			<Grid container spacing={2}>
				<BigIndicator
					main={formatValue(
						typeof totals === 'number' ? totals : totals.accueil
					)}
					subTitle="Visites"
				/>
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
					<SatisfactionChart key={chapter2} data={satisfaction} />
				</>
			)}

			{chapter2 === '' && period === 'mois' && (
				<>
					<H2>Simulateurs principaux</H2>
					<PagesChart data={repartition} />
				</>
			)}
		</>
	)
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

export default function Stats() {
	const { data: stats, loading } = useFetchData<StatsStruct>('/data/stats.json')

	const statsAvailable = stats?.visitesMois != null

	return (
		<>
			{statsAvailable ? (
				<>
					<StatsDetail stats={stats} />
					<GlobalStats stats={stats} />
				</>
			) : loading ? (
				<Intro>Chargement des statistiques...</Intro>
			) : (
				<Body>Statistiques indisponibles.</Body>
			)}

			<DemandeUtilisateurs />
		</>
	)
}

function getChapter2(s: SimulatorData[keyof SimulatorData]): Chapter2 | '' {
	if ('iframePath' in s && s.iframePath === 'pamc') {
		return 'PAM'
	}
	if (!s.tracking) {
		return ''
	}
	const tracking = s.tracking as { chapter2?: Chapter2 }
	const chapter2 =
		typeof tracking === 'string' ? tracking : tracking.chapter2 ?? ''

	return toAtString(chapter2) as typeof chapter2
}

function SelectedSimulator(props: { chapter2: Chapter2 | '' }) {
	const simulateur = Object.values(useSimulatorsData()).find(
		(s) =>
			getChapter2(s) === props.chapter2 &&
			!(
				typeof s.tracking === 'object' &&
				'chapter3' in s.tracking &&
				s.tracking.chapter3
			)
	)
	if (!simulateur) {
		return null
	}

	return <SimulateurCard small {...simulateur} />
}

function SimulateursChoice(props: {
	onChange: (ch: Chapter2 | '') => void
	value: Chapter2 | ''
	possibleValues: Array<Chapter2>
}) {
	const simulateurs = Object.values(useSimulatorsData())
		.filter((s) => {
			const chapter2 = getChapter2(s)

			return (
				chapter2 &&
				props.possibleValues.includes(chapter2) &&
				!(
					typeof s.tracking === 'object' &&
					'chapter3' in s.tracking &&
					s.tracking.chapter3
				)
			)
		})
		.sort((a, b) => (a.shortName < b.shortName ? -1 : 1))

	return (
		<Select
			onSelectionChange={(val) => {
				props.onChange(
					typeof val === 'string' && val.length
						? getChapter2(simulateurs[parseInt(val)])
						: ''
				)
			}}
			defaultSelectedKey={props.value}
			label={'Sélectionner la fonctionnalité'}
		>
			{[
				<Item key={''} textValue="Tout le site">
					<Emoji emoji="🌍" />
					Tout le site
				</Item>,
				...simulateurs.map((s, i) => (
					<Item key={i} textValue={s.shortName}>
						{s.icône && (
							<>
								<Emoji emoji={s.icône} />
								&nbsp;
							</>
						)}
						{s.shortName}
					</Item>
				)),
			]}
		</Select>
	)
}
