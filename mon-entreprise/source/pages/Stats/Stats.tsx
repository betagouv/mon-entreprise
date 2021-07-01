import classnames from 'classnames'
import Privacy from 'Components/layout/Footer/Privacy'
import MoreInfosOnUs from 'Components/MoreInfosOnUs'
import InfoBulle from 'Components/ui/InfoBulle'
import { useScrollToHash } from 'Components/utils/markdown'
import { ScrollToTop } from 'Components/utils/Scroll'
import { formatValue } from 'publicodes'
import { add, groupBy, mapObjIndexed, mergeWith, toPairs } from 'ramda'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import emoji from 'react-easy-emoji'
import { Trans } from 'react-i18next'
import { useHistory, useLocation } from 'react-router-dom'
import { TrackPage } from '../../ATInternetTracking'
import statsJson from '../../data/stats.json'
import { debounce } from '../../utils'
import { SimulateurCard } from '../Simulateurs/Home'
import useSimulatorsData, { SimulatorData } from '../Simulateurs/metadata'
import Chart from './Chart'
import DemandeUtilisateurs from './DemandesUtilisateurs'
import GlobalStats from './GlobalStats'
import { formatDay, formatMonth, Indicators, Indicator } from './utils'
import SatisfactionChart from './SatisfactionChart'
import { StatsStruct, PageChapter2, Page, PageSatisfaction } from './types'

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

type Pageish = Page & PageSatisfaction

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
			(p) => p.date,
			pages.filter(
				(p) =>
					!chapter2 ||
					(p.page !== 'accueil_pamc' &&
						(p.page_chapter2 === chapter2 ||
							(chapter2 === 'PAM' && isPAM(p.page_chapter3))))
			)
		)
	).map(([date, values]) => ({
		date,
		nombre: mapObjIndexed(
			(v: Array<{ nombre: number }>) => v.map((v) => v.nombre).reduce(add),
			groupBy((x) => x.page ?? x.click ?? '', values)
		),
	}))
}

function groupByDate(data: Pageish[]) {
	return toPairs(
		groupBy(
			(p) => p.date,
			data.filter((d) => d.page === 'accueil')
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
			<h2>Statistiques détaillées</h2>
			<p>
				<strong>1. Sélectionner la fonctionnalité : </strong>
			</p>
			<p>
				<SimulateursChoice
					onChange={setChapter2}
					value={chapter2}
					possibleValues={chapters2}
				/>
			</p>
			<p>
				<strong>2. Choisir l'échelle de temps : </strong>

				{['jours', 'mois'].map((p) => (
					<label
						key={p}
						className={classnames('ui__ small button', {
							selected: period === p,
						})}
						css={{ marginRight: '0.4rem' }}
					>
						<input
							type="radio"
							value={p}
							onChange={(event) => setPeriod(event.target.value as Period)}
							checked={period === p}
						/>
						<span>
							<Trans>{p}</Trans>
						</span>
					</label>
				))}
			</p>
			<div className="ui__ full-width">
				<div className="ui__ container-and-side-block">
					<div
						className="ui__ side-block"
						css={`
							align-items: flex-end;
						`}
					>
						<SelectedSimulator chapter2={chapter2} />
					</div>
					<div className="ui__ container">
						<h2>Visites</h2>

						<Chart
							key={period + visites.length}
							period={period}
							data={visites}
							onDateChange={handleDateChange}
							startIndex={startDateIndex}
							endIndex={endDateIndex}
						/>

						<h2>
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
						</h2>
						<Indicators>
							<Indicator
								main={formatValue(
									typeof totals === 'number' ? totals : totals.accueil
								)}
								subTitle="Visites"
							/>
							{typeof totals !== 'number' && 'simulation_commencee' in totals && (
								<>
									{' '}
									<Indicator
										main={formatValue(totals.simulation_commencee)}
										subTitle="Simulations "
									/>
									<Indicator
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
						</Indicators>
						{period === 'mois' && !!satisfaction.length && (
							<>
								<h2>Satisfaction</h2>
								<SatisfactionChart key={chapter2} data={satisfaction} />
							</>
						)}
						{chapter2 === '' && period === 'mois' && (
							<>
								<h2>Principales pages</h2>
								<Chart
									colored
									period={'mois'}
									data={repartition}
									grid={false}
									layout={'vertical'}
								/>
							</>
						)}
					</div>
					<div
						css={`
							flex: 1;
						`}
					/>
				</div>
			</div>
		</>
	)
}

export default function Stats() {
	return (
		<>
			<TrackPage chapter1="informations" name="stats" />
			<ScrollToTop />

			<h1>
				Statistiques <>{emoji('📊')}</>
			</h1>
			<p>
				Découvrez nos statistiques d'utilisation mises à jour quotidiennement.
				<br />
				Les données recueillies sont anonymisées.{' '}
				<Privacy label="En savoir plus" />
			</p>
			<GlobalStats stats={stats} />
			<StatsDetail />

			<DemandeUtilisateurs />
			<MoreInfosOnUs />
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
	return typeof tracking === 'string' ? tracking : tracking.chapter2 ?? ''
}
function SelectedSimulator(props: { chapter2: Chapter2 | '' }) {
	const simulateur = Object.values(useSimulatorsData()).find(
		(s) => getChapter2(s) === props.chapter2 && !(s.tracking as any).chapter3
	)
	if (!simulateur) {
		return null
	}
	return <SimulateurCard {...simulateur} />
}

function SimulateursChoice(props: {
	onChange: (ch: Chapter2 | '') => void
	value: Chapter2 | ''
	possibleValues: Array<Chapter2>
}) {
	const simulateurs = Object.values(useSimulatorsData()).filter((s) => {
		const chapter2 = getChapter2(s)
		return (
			chapter2 &&
			props.possibleValues.includes(chapter2) &&
			!(s.tracking as any).chapter3
		)
	})

	return (
		<div
			css={`
				display: flex;
				flex-wrap: wrap;
				margin-right: -0.4rem;
				> * {
					margin-bottom: 0.4rem;

					margin-right: 0.4rem;
				}
			`}
		>
			<label
				className={classnames('ui__ small button', {
					selected: props.value === '',
				})}
			>
				<input
					type="radio"
					name="simulateur"
					value={'site'}
					onChange={() => props.onChange('')}
					checked={props.value === ''}
				/>
				<span>
					{emoji('🌍')}
					<Trans>Tout le site</Trans>
				</span>
			</label>
			{simulateurs.map((s) => (
				<label
					key={s.shortName}
					className={classnames('ui__ small button', {
						selected: getChapter2(s) === props.value,
					})}
				>
					<input
						type="radio"
						name="simulateur"
						value={getChapter2(s)}
						onChange={(evt) =>
							props.onChange(evt.target.value as Chapter2 | '')
						}
						checked={getChapter2(s) === props.value}
					/>
					<span>
						{s.icône && <>{emoji(s.icône)}&nbsp;</>}
						<Trans>{s.shortName}</Trans>
					</span>
				</label>
			))}
		</div>
	)
}
