import BarChartBranch from 'Components/BarChart'
import MoreInfosOnUs from 'Components/MoreInfosOnUs'
import { StackedBarChart } from 'Components/StackedBarChart'
import { ThemeColorsContext } from 'Components/utils/colors'
import { ScrollToTop } from 'Components/utils/Scroll'
import { formatValue } from 'publicodes'
import { groupWith } from 'ramda'
import React, { useContext, useState } from 'react'
import emoji from 'react-easy-emoji'
import { Link } from 'react-router-dom'
import {
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	ReferenceArea,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis
} from 'recharts'
import styled from 'styled-components'
import statsJson from '../../../../data/stats.json'
import { capitalise0 } from '../../../../utils'
import Privacy from '../../layout/Footer/Privacy'
import useSimulatorsData from '../Simulateurs/metadata'

const stats: StatsData = statsJson as any

const monthPeriods = [
	'currentMonth',
	'oneMonthAgo',
	'twoMonthAgo',
	'threeMonthAgo',
	'fourMonthAgo'
] as const
type MonthPeriod = typeof monthPeriods[number]

type Periodicity = 'daily' | 'monthly'

type StatsData = {
	feedback: {
		simulator: number
		content: number
	}
	statusChosen: Array<{
		label: string
		nb_visits: number
	}>
	dailyVisits: Array<{
		date: string
		visiteurs: number
	}>
	monthlyVisits: Array<{
		date: string
		visiteurs: number
	}>
	simulators: Record<
		MonthPeriod,
		{
			date: string
			visites: Array<{ label: string; nb_visits: number }>
		}
	>
	channelType: Record<
		MonthPeriod,
		{
			date: string
			visites: Array<{ label: string; nb_visits: number }>
		}
	>
}

export default function Stats() {
	const [choice, setChoice] = useState<Periodicity>('monthly')
	const [choicesimulators, setChoicesimulators] = useState<MonthPeriod>(
		'oneMonthAgo'
	)
	const { palettes } = useContext(ThemeColorsContext)
	const simulators = Object.values(useSimulatorsData())
	return (
		<>
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
			<section>
				<SectionTitle>
					<h2>Nombre de visites</h2>
					<span>
						{emoji('🗓')}{' '}
						<select
							onChange={event => {
								setChoice(event.target.value as Periodicity)
							}}
							value={choice}
						>
							<option value="monthly">les derniers mois</option>
							<option value="daily">les derniers jours</option>
						</select>
					</span>
				</SectionTitle>
				<LineChartVisits periodicity={choice} />

				<Indicators>
					<Indicator main="1,7 million" subTitle="Visiteurs en 2019" />
					<Indicator
						main="52,9%"
						subTitle="Convertissent en lançant une simulation"
					/>
				</Indicators>
			</section>
			<section>
				<SectionTitle>
					<h2>Nombre d'utilisation des simulateurs</h2>
					<PeriodSelector
						onChange={event => {
							setChoicesimulators(event.target.value as MonthPeriod)
						}}
						value={choicesimulators}
					/>
				</SectionTitle>

				{stats.simulators[choicesimulators].visites.map(
					({ label, nb_visits }) => {
						const details = simulators.find(({ path }) => path?.endsWith(label))
						if (!details) {
							return null
						}
						return (
							<BarChartBranch
								key={label}
								value={nb_visits}
								title={
									<>
										{details.shortName}{' '}
										<Link
											className="distribution-chart__link_icone"
											to={{
												state: { fromSimulateurs: true },
												pathname: details.path
											}}
											title="Accéder au simulateur"
											css="font-size:0.75em"
										>
											{emoji('📎')}
										</Link>
									</>
								}
								icon={details.icône}
								maximum={stats.simulators[choicesimulators].visites.reduce(
									(a, b) => Math.max(a, b.nb_visits),
									0
								)}
								unit="visiteurs"
							/>
						)
					}
				)}
			</section>
			<section>
				<SectionTitle>
					<h2>Origine du trafic</h2>
					<PeriodSelector
						onChange={event => {
							setChoicesimulators(event.target.value as MonthPeriod)
						}}
						value={choicesimulators}
					/>
				</SectionTitle>

				<StackedBarChart
					data={stats.channelType[choicesimulators].visites
						.map((data, i) => ({
							value: data.nb_visits,
							key: data.label,
							legend: capitalise0(data.label),
							color: palettes[i][0]
						}))
						.reverse()}
				/>
			</section>
			<section>
				<h2>Avis des visiteurs</h2>
				<Indicators>
					<Indicator
						main={formatValue(stats.feedback.simulator, {
							displayedUnit: '%'
						})}
						subTitle="Taux de satisfaction sur les simulateurs"
					/>
					<Indicator
						main={formatValue(stats.feedback.content, {
							displayedUnit: '%'
						})}
						subTitle="Taux de satisfaction sur le contenu"
					/>
				</Indicators>
				<p>
					Ces indicateurs sont calculés à partir des boutons de retours affichés
					en bas de toutes les pages.
				</p>
			</section>
			<section>
				<h2>Statut choisi le mois dernier</h2>
				{stats.statusChosen.map(x => (
					<BarChartBranch
						key={x.label}
						value={x.nb_visits}
						title={capitalise0(x.label)}
						maximum={stats.statusChosen.reduce(
							(a, b) => Math.max(a, b.nb_visits),
							0
						)}
						unit="visiteurs"
					/>
				))}
			</section>

			<MoreInfosOnUs />
		</>
	)
}

const weekEndDays = groupWith(
	(a, b) => {
		const dayAfterA = new Date(a)
		dayAfterA.setDate(dayAfterA.getDate() + 1)
		return dayAfterA.toISOString().substring(0, 10) === b
	},
	stats.dailyVisits
		.map(({ date }) => new Date(date))
		.filter(date => date.getDay() === 0 || date.getDay() === 6)
		.map(date => date.toISOString().substring(0, 10))
)

function PeriodSelector(props: React.ComponentProps<'select'>) {
	const formatDate = (date: string) =>
		new Date(date).toLocaleString('default', {
			month: 'long',
			year: 'numeric'
		})
	return (
		<span>
			{emoji('🗓')}{' '}
			<select {...props}>
				{monthPeriods.map(monthPeriod => (
					<option key={monthPeriod} value={monthPeriod}>
						{formatDate(stats.simulators[monthPeriod].date)}
					</option>
				))}
			</select>
		</span>
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
			css={`
				text-align: center;
				width: 210px;
			`}
		>
			<div
				css={`
					font-size: 2.3rem;
				`}
			>
				{main}
			</div>
			<div>{subTitle}</div>
		</div>
	)
}

type LineChartVisitsProps = {
	periodicity: Periodicity
}

function LineChartVisits({ periodicity }: LineChartVisitsProps) {
	const { color } = useContext(ThemeColorsContext)
	const data = periodicity === 'daily' ? stats.dailyVisits : stats.monthlyVisits

	return (
		<ResponsiveContainer width="100%" height={400}>
			<LineChart
				data={data}
				margin={{
					top: 5,
					right: 30,
					left: 20,
					bottom: 5
				}}
			>
				<CartesianGrid />
				<XAxis
					dataKey="date"
					tickFormatter={tickItem => formatDate(tickItem, periodicity)}
				/>
				<YAxis
					dataKey="visiteurs"
					tickFormatter={tickItem => formatValue(tickItem)}
				/>
				{periodicity === 'daily' ? (
					<Legend
						payload={[
							{
								value: 'Week-End',
								type: 'rect',
								color: '#e5e5e5',
								id: 'weedkend'
							}
						]}
					/>
				) : null}
				<Tooltip content={<CustomTooltip periodicity={periodicity} />} />
				{weekEndDays
					.filter(days => days.length === 2)
					.map(days => (
						<ReferenceArea
							key={days[0]}
							x1={days[0]}
							x2={days[1]}
							strokeOpacity={0.3}
						/>
					))}
				<Line
					type="monotone"
					dataKey="visiteurs"
					stroke={color}
					strokeWidth={3}
					animationDuration={500}
				/>
			</LineChart>
		</ResponsiveContainer>
	)
}

function formatDate(date: string | Date, periodicity?: Periodicity) {
	if (periodicity === 'monthly') {
		return new Date(date).toLocaleString('default', {
			month: 'short',
			year: '2-digit'
		})
	} else {
		return new Date(date).toLocaleString('default', {
			day: '2-digit',
			month: '2-digit'
		})
	}
}

type CustomTooltipProps = {
	active?: boolean
	periodicity: Periodicity
	payload?: any
}

const CustomTooltip = ({
	active,
	periodicity,
	payload
}: CustomTooltipProps) => {
	if (!active) {
		return null
	}
	return (
		<p className="ui__ card">
			<strong>{formatValue(payload[0].payload.visiteurs)} visites</strong>
			<br />
			{formatDate(payload[0].payload.date, periodicity)}
		</p>
	)
}

const SectionTitle = styled.div`
	display: flex;
	justify-content: space-between;
	margin-bottom: 2rem;

	h2 {
		margin: 0;
	}
`
