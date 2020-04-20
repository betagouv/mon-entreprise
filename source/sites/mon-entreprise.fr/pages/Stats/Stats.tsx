import { ThemeColorsContext } from 'Components/utils/colors'
import { ScrollToTop } from 'Components/utils/Scroll'
import React, { useContext, useState } from 'react'
import emoji from 'react-easy-emoji'
import {
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis
} from 'recharts'
import DefaultTooltipContent from 'recharts/lib/component/DefaultTooltipContent'
import {
	formatPercentage,
	formatValue
} from '../../../../../source/engine/format'
import MoreInfosOnUs from 'Components/MoreInfosOnUs'
import Privacy from '../../layout/Footer/Privacy'
import statsJson from '../../../../data/stats.json'
import { capitalise0 } from '../../../../utils'
import DistributionBranch from 'Components/BarChart'
import { simulateursDetails } from '../Simulateurs/Home'

const stats: StatsData = statsJson as any

type StatsData = {
	feedback: {
		simulator: number
		content: number
	}
	status_chosen: Array<{
		label: string
		nb_visits: number
	}>
	daily_visits: Array<{
		date: string
		visiteurs: number
	}>
	monthly_visits: Array<{
		date: string
		visiteurs: number
	}>
	simulators: {
		currentMonth: {
			date: string
			visites: Array<{ label: string; nb_visits: string }>
		}
		oneMonthAgo: {
			date: string
			visites: Array<{ label: string; nb_visits: string }>
		}
		twoMonthAgo: {
			date: string
			visites: Array<{ label: string; nb_visits: string }>
		}
	}
}

export default function Stats() {
	const [choice, setChoice] = useState<LineChartVisitsProps['periodicity']>(
		'monthly'
	)
	const [choicesimulators, setChoicesimulators] = useState('oneMonthAgo')
	const { color } = useContext(ThemeColorsContext)

	return (
		<>
			<ScrollToTop />
			<h1>
				Statistiques <>{emoji('📊')}</>
			</h1>
			<p>
				Découvrez nos statistiques d'utilisation mises à jour quotidiennement.
				Les données recueillies sont anonymisées.{' '}
				<Privacy label="En savoir plus" />
			</p>
			<section>
				<div
					css={`
						display: flex;
						justify-content: space-between;

						h2 {
							margin: 0;
						}
					`}
				>
					<h2>Nombre de visites</h2>
					<select
						onChange={event => {
							setChoice(
								event.target.value as LineChartVisitsProps['periodicity']
							)
						}}
						value={choice}
					>
						<option value="monthly">les derniers mois</option>
						<option value="daily">les derniers jours</option>
					</select>
				</div>
				<div
					css={`
						margin-top: 3em;
					`}
				>
					<LineChartVisits periodicity={choice} />
				</div>

				<div
					css={`
						display: flex;
						flex-direction: row;
						justify-content: space-around;
						margin-top: 2rem;
					`}
				>
					<Indicator main="1,7 million" subTitle="Visiteurs en 2019" />
					<Indicator
						main="52,9%"
						subTitle="Convertissent en lançant une simulation"
					/>
				</div>
			</section>
			<section>
				<div
					css={`
						display: flex;
						justify-content: space-between;

						h2 {
							margin: 0;
						}
					`}
				>
					<h2>Nombre d'utilisation des simulateurs</h2>
					<select
						onChange={event => {
							setChoicesimulators(event.target.value)
						}}
						value={choicesimulators}
					>
						<option value="currentMonth">
							{transformDate(stats.simulators.currentMonth.date)}
						</option>
						<option value="oneMonthAgo">
							{transformDate(stats.simulators.oneMonthAgo.date)}
						</option>
						<option value="twoMonthAgo">
							{transformDate(stats.simulators.twoMonthAgo.date)}
						</option>
					</select>
				</div>
				<div
					css={`
						margin-top: 3em;
					`}
				>
					{stats.simulators[choicesimulators].visites.map(x => (
						<DistributionBranch
							key={x.label}
							data={x.nb_visits}
							title={simulateursDetails[x.label].name}
							icon={simulateursDetails[x.label].icone}
							total={stats.simulators[choicesimulators].visites.reduce(
								(a, b) => Math.max(a, b.nb_visits),
								0
							)}
							unit="visiteurs"
						/>
					))}
				</div>
			</section>
			<section>
				<h2>Avis des visiteurs</h2>
				<div
					css={`
						display: flex;
						flex-direction: row;
						justify-content: space-around;
						margin: 2rem 0;
					`}
				>
					<Indicator
						main={formatPercentage(stats.feedback.simulator)}
						subTitle="Taux de satisfaction sur les simulateurs"
					/>
					<Indicator
						main={formatPercentage(stats.feedback.content)}
						subTitle="Taux de satisfaction sur le contenu"
					/>
				</div>
				<p>
					Ces indicateurs sont calculés à partir des boutons de retours affichés
					en bas de toutes les pages.
				</p>
			</section>
			<section>
				<h2>Statut choisi le mois dernier</h2>
				{stats.status_chosen.map(x => (
					<DistributionBranch
						key={x.label}
						data={x.nb_visits}
						title={capitalise0(x.label)}
						total={stats.status_chosen.reduce(
							(a, b) => Math.max(a, b.nb_visits),
							0
						)}
						unit="visiteurs"
					/>
				))}
				<div id="status-indicators"></div>
			</section>
			<MoreInfosOnUs />
		</>
	)
}

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
	periodicity: 'daily' | 'monthly'
}

function LineChartVisits({ periodicity }: LineChartVisitsProps) {
	const { color } = useContext(ThemeColorsContext)
	const data =
		periodicity === 'daily' ? stats.daily_visits : stats.monthly_visits
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
					tickFormatter={tickItem =>
						transformDateReducedMonth(periodicity, tickItem)
					}
				/>
				<YAxis
					dataKey="visiteurs"
					tickFormatter={tickItem =>
						formatValue({ value: tickItem, language: 'fr' })
					}
				/>
				<Tooltip content={<CustomTooltip periodicity={periodicity} />} />
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

function transformDate(date) {
	const [month, year] = date.split('-')
	return `${months[month - 1]} ${year}`
}
function transformDateReducedMonth(periodicity, date) {
	if (periodicity == 'monthly') {
		const [month, year] = date.split('/')
		return `${reducedMonths[month - 1]} ${year}`
	} else {
		return date
	}
}

const CustomTooltip = props => {
	if (!props.active) {
		return null
	}
	const newPayload = [
		{
			value: transformDateReducedMonth(
				props.periodicity,
				props.payload[0].payload.date
			)
		},
		{
			value: formatValue({
				value: props.payload[0].payload.visiteurs,
				language: 'fr'
			}),
			unit: ' visiteurs'
		}
	]
	return <DefaultTooltipContent payload={newPayload} />
}

const months = [
	'Janvier',
	'Février',
	'Mars',
	'Avril',
	'Mai',
	'Juin',
	'Juillet',
	'Aout',
	'Septembre',
	'Octobre',
	'Novembre',
	'Decembre'
]

const reducedMonths = [
	'Janv.',
	'Févr.',
	'Mars',
	'Avr.',
	'Mai',
	'Juin',
	'Juill.',
	'Aout',
	'Sept.',
	'Oct.',
	'Nov.',
	'Déc.'
]
