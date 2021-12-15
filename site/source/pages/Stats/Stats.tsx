import { Grid } from '@mui/material'
import PagesChart from 'Components/charts/PagesCharts'
import InfoBulle from 'Components/ui/InfoBulle'
import Emoji from 'Components/utils/Emoji'
import { useScrollToHash } from 'Components/utils/markdown'
import { Radio, ToggleGroup } from 'DesignSystem/field'
import { Item, Select } from 'DesignSystem/field/Select'
import { Spacing } from 'DesignSystem/layout'
import { H2, H3 } from 'DesignSystem/typography/heading'
import { formatValue } from 'publicodes'
import { add, groupBy, mapObjIndexed, mergeWith, toPairs } from 'ramda'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Trans } from 'react-i18next'
import { useHistory, useLocation } from 'react-router-dom'
import { toAtString } from '../../ATInternetTracking'
import statsJson from 'Data/stats.json'
import { debounce } from '../../utils'
import { SimulateurCard } from '../Simulateurs/Home'
import useSimulatorsData, { SimulatorData } from '../Simulateurs/metadata'
import Chart from './Chart'
import DemandeUtilisateurs from './DemandesUtilisateurs'
import GlobalStats, { BigIndicator } from './GlobalStats'
import SatisfactionChart from './SatisfactionChart'
import { Page, PageChapter2, PageSatisfaction, StatsStruct } from './types'
import { formatDay, formatMonth } from './utils'

const stats = statsJson as unknown as StatsStruct

type Period = 'mois' | 'jours'
type Chapter2 = PageChapter2 | 'PAM'

const chapters2: Chapter2[] = [
	...new Set(stats.visitesMois.pages.map((p) => p.page_chapter2)),
	'PAM',
]

type Data =
	| Array<{ date: string; nombre: number }>
	| Array<{ date: string; nombre: Record<string, number> }>

type Pageish = Page | PageSatisfaction

const isPAM = (name: string | undefined) =>
	name &&
	[
		'medecin',
		'chirurgien_dentiste',
		'auxiliaire_medical',
		'sage_femme',
	].includes(name)

const filterByChapter2 = (
	pages: Pageish[],
	chapter2: Chapter2 | ''
): Array<{ date: string; nombre: Record<string, number> }> => {
	return toPairs(
		groupBy(
			(p) => ('date' in p ? p.date : p.month),
			pages.filter(
				(p) =>
					!chapter2 ||
					((!('page' in p) || p.page !== 'accueil_pamc') &&
						(p.page_chapter2 === chapter2 ||
							(chapter2 === 'PAM' && isPAM(p.page_chapter3))))
			)
		)
	).map(([date, values]) => ({
		date,
		nombre: mapObjIndexed(
			(v: Array<{ nombre: number }>) => v.map((v) => v.nombre).reduce(add),
			groupBy((x) => ('page' in x ? x.page : x.click), values)
		),
	}))
}

function groupByDate(data: Pageish[]) {
	return toPairs(
		groupBy(
			(p) => ('date' in p ? p.date : p.month),
			data.filter((d) => 'page' in d && d.page === 'accueil')
		)
	).map(([date, values]) => ({
		date,
		nombre: Object.fromEntries(
			Object.entries(
				groupBy((x) => x.page_chapter1 + ' / ' + x.page_chapter2, values)
			)
				.map(([k, v]) => [k, v.map((v) => v.nombre).reduce(add, 0)] as const)
				.sort((a, b) => b[1] - a[1])
				.slice(0, 7)
		),
	}))
}

const computeTotals = (data: Data): number | Record<string, number> => {
	if (typeof data[0].nombre === 'number') {
		return (data as Data & { nombre: number }[])
			.map((d) => d.nombre)
			.reduce(add, 0)
	}
	return (data as Data & { nombre: Record<string, number> }[])
		.map((d) => d.nombre)
		.reduce(mergeWith(add), {})
}

const StatsDetail = () => {
	const defaultPeriod = 'mois'
	const history = useHistory()
	const location = useLocation()
	useScrollToHash()
	const urlParams = new URLSearchParams(location.search ?? '')

	const [period, setPeriod] = useState<Period>(
		(urlParams.get('periode') as Period) ?? defaultPeriod
	)
	const [chapter2, setChapter2] = useState<Chapter2 | ''>(
		(urlParams.get('module') as Chapter2) ?? ''
	)

	// The logic to persist some state in query parameters in the URL could be
	// abstracted in a dedicated React hook.
	useEffect(() => {
		const queryParams = [
			period !== defaultPeriod && `periode=${period}`,
			chapter2 && `module=${chapter2}`,
		].filter(Boolean)
		history.replace({
			search: `?${queryParams.join('&')}`,
			hash: location.hash,
		})
	}, [period, chapter2])

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
	const handleDateChange = useCallback(
		debounce(
			1000,
			({ startIndex, endIndex }: { startIndex: number; endIndex: number }) => {
				setDateIndex([startIndex, endIndex])
				setSlicedVisits(visites.slice(startIndex, endIndex + 1))
			}
		),
		[setDateIndex, visites]
	)

	const totals: number | Record<string, number> = useMemo(
		() => computeTotals(slicedVisits),
		[slicedVisits]
	)

	return (
		<>
			<H2>Statistiques détaillées</H2>
			<Grid
				container
				spacing={2}
				justifyContent="space-between"
				alignItems="flex-end"
			>
				<Grid item xs={12} sm={6} md={4}>
					<SimulateursChoice
						onChange={setChapter2}
						value={chapter2}
						possibleValues={chapters2}
					/>
					<Spacing sm />
					<Grid container columns={4}>
						<SelectedSimulator chapter2={chapter2} />
					</Grid>
				</Grid>
				<Grid item>
					<ToggleGroup onChange={setPeriod as any} defaultValue={period}>
						<Radio value="jours">
							<Trans>jours</Trans>
						</Radio>
						<Radio value="mois">
							<Trans>mois</Trans>
						</Radio>
					</ToggleGroup>
				</Grid>
			</Grid>

			<Spacing lg />

			<H3>Visites</H3>

			<Chart
				key={period + visites.length}
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

export default function Stats() {
	return (
		<>
			<GlobalStats stats={stats} />
			<StatsDetail />

			<DemandeUtilisateurs />
		</>
	)
}

function getChapter2(s: SimulatorData[keyof SimulatorData]): Chapter2 | '' {
	if (s.iframePath === 'pamc') {
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
		(s) => getChapter2(s) === props.chapter2 && !(s.tracking as any).chapter3
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
				!(s.tracking as any).chapter3
			)
		})
		.sort((a, b) => (a.shortName < b.shortName ? -1 : 1))

	return (
		<Select
			onSelectionChange={props.onChange as any}
			defaultSelectedKey={props.value}
			label={'Selectionner la fonctionnalité'}
		>
			<Item key={''} textValue="Tout le site">
				<Emoji emoji="🌍" />
				Tout le site
			</Item>
			{
				simulateurs.map((s) => (
					<Item key={getChapter2(s)} textValue={s.shortName}>
						{s.icône && (
							<>
								<Emoji emoji={s.icône} />
								&nbsp;
							</>
						)}
						{s.shortName}
					</Item>
				)) as any
			}
		</Select>
	)
}
