import classnames from 'classnames'
import Privacy from 'Components/layout/Footer/Privacy'
import MoreInfosOnUs from 'Components/MoreInfosOnUs'
import { ScrollToTop } from 'Components/utils/Scroll'
import { formatValue } from 'publicodes'
import { add, groupBy, mapObjIndexed, mergeWith, toPairs } from 'ramda'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import emoji from 'react-easy-emoji'
import { Trans } from 'react-i18next'
import styled from 'styled-components'
import { TrackPage } from '../../ATInternetTracking'
import stats from '../../data/stats.json'
import { debounce } from '../../utils'
import useSimulatorsData, { SimulatorData } from '../Simulateurs/metadata'
import Chart from './Chart'
import DemandeUtilisateurs from './DemandesUtilisateurs'
import SatisfactionChart from './SatisfactionChart'

type Period = 'mois' | 'jours'
type Chapter2 = typeof stats.visitesJours.pages[number]['page_chapter2']
const chapters2: Chapter2[] = [
	...new Set(stats.visitesMois.pages.map((p) => p.page_chapter2)),
]

type Data =
	| Array<{ date: string; nombre: number }>
	| Array<{ date: string; nombre: Record<string, number> }>

const filterByChapter2 = (
	data: Array<{
		date: string
		page_chapter2: string
		page?: string
		click?: string
	}>,
	chapter2: Chapter2
): Array<{ date: string; nombre: Record<string, number> }> => {
	return toPairs(
		groupBy(
			(p) => p.date,
			data.filter((p) => !chapter2 || p.page_chapter2 === chapter2)
		)
	).map(([date, values]) => ({
		date,
		nombre: mapObjIndexed(
			(v: Array<{ nombre: number }>) => v.map((v) => v.nombre).reduce(add),
			groupBy((x) => x.page ?? x.click ?? '', values)
		),
	}))
}

const computeTotals = (data: Data): number | Record<string, number> => {
	const visites = data.map((d) => d.nombre)
	if (typeof visites[0] === 'number') {
		return visites.reduce(add, 0)
	}
	return visites.reduce(mergeWith(add), {})
}
export default function Stats() {
	const [period, setPeriod] = useState<Period>('mois')
	const [chapter2, setChapter2] = useState<Chapter2 | ''>('')
	const visites = useMemo(() => {
		const rawData = period === 'jours' ? stats.visitesJours : stats.visitesMois
		if (!chapter2) {
			return rawData.site
		}
		return filterByChapter2(rawData.pages, chapter2)
	}, [period, chapter2])

	const satisfaction = useMemo(() => {
		return filterByChapter2(stats.satisfaction, chapter2)
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
			<SimulateursChoice
				onChange={setChapter2}
				value={chapter2}
				possibleValues={chapters2}
			/>
			<div style={{ display: 'flex' }}>
				<span className="ui__  small radio toggle">
					{['jours', 'mois'].map((p) => (
						<label key={p}>
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
				</span>
			</div>
			<section>
				<h2>Visites</h2>

				<Chart
					period={period}
					data={visites}
					onDateChange={handleDateChange}
					startIndex={startDateIndex}
					endIndex={endDateIndex}
				/>
				{period === 'mois' && !!satisfaction.length && (
					<section>
						<h2>Satisfaction</h2>
						<SatisfactionChart
							period="mois"
							key={chapter2}
							data={satisfaction}
						/>
					</section>
				)}
				<section>
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
				</section>

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
								subTitle="Taux de conversion"
							/>
						</>
					)}
				</Indicators>
			</section>
			<DemandeUtilisateurs />
			<MoreInfosOnUs />
		</>
	)
}

const Indicators = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	margin: 2rem 0;
`

type IndicatorProps = {
	main?: string
	subTitle?: string
}

function Indicator({ main, subTitle }: IndicatorProps) {
	return (
		<div
			className="ui__ card lighter-bg"
			css={`
				text-align: center;
				padding: 1rem;
				width: 210px;
				font-size: 110%;
			`}
		>
			<small>{subTitle}</small>
			<br />
			<strong>{main}</strong>
		</div>
	)
}

function formatDay(date: string | Date) {
	return new Date(date).toLocaleString('default', {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
	})
}

function formatMonth(date: string | Date) {
	return new Date(date).toLocaleString('default', {
		month: 'long',
		year: 'numeric',
	})
}

function getChapter2(s: SimulatorData[keyof SimulatorData]): Chapter2 | '' {
	if (!s.tracking) {
		return ''
	}
	return typeof s.tracking === 'string' ? s.tracking : s.tracking.chapter2 ?? ''
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
			!s.tracking.chapter3
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
						onChange={(evt) => props.onChange(evt.target.value)}
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
