import { ScrollToTop } from 'Components/utils/Scroll'
import React, { useState } from 'react'
import emoji from 'react-easy-emoji'
import {
	Bar,
	BarChart,
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis
} from 'recharts'
import stats from '../../../../data/stats.json'

type IndicatorProps = {
	main: string
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
					font-size: 2.5em;
				`}
			>
				{main}
			</div>
			<div>{subTitle}</div>
		</div>
	)
}

function LineChart_Visites({ test }) {
	const data2 = test === 'daily' ? stats.daily_visits : stats.monthly_visits
	return (
		<ResponsiveContainer width="100%" height={300}>
			<LineChart
				data={data2}
				margin={{
					top: 5,
					right: 30,
					left: 20,
					bottom: 5
				}}
			>
				<CartesianGrid />
				<XAxis dataKey="date" padding={{ right: 30 }} />
				<YAxis />
				<Tooltip />
				<Line
					type="monotone"
					dataKey="visiteurs"
					stroke="#8884d8"
					strokeWidth={3}
				/>
			</LineChart>
		</ResponsiveContainer>
	)
}

export default function Stats() {
	let d202004 = stats.simulators[11].values

	const [choice, setChoice] = useState('monthly')
	return (
		<>
			<ScrollToTop />
			<h1>
				Statistiques <>{emoji('📊')}</>
			</h1>
			<section>
				<h2>Nombre de visites</h2>
				<div
					css={`
						float: right;
					`}
				>
					<select
						onChange={event => {
							setChoice(event.target.value)
						}}
					>
						<option value="monthly">12 derniers mois</option>
						<option value="daily"> 30 derniers jours</option>
					</select>
				</div>
				<div
					css={`
						margin-top: 3em;
					`}
				>
					<LineChart_Visites test={choice} />
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
				<h2>Avis des visiteurs</h2>
				<div
					css={`
						display: flex;
						flex-direction: row;
						justify-content: space-around;
						margin-top: 2rem;
					`}
				>
					<Indicator
						main={stats.feedback.simulator.toString().concat(' ', '%')}
						subTitle="Taux de satisfaction sur les simulateurs"
					/>
					<Indicator
						main={stats.feedback.content.toString().concat(' ', '%')}
						subTitle="Taux de satisfaction sur le contenu"
					/>
				</div>
			</section>

			<section>
				<h2> Nombre d'utilisation des simulateurs</h2>
				<ResponsiveContainer width="100%" height={300}>
					<BarChart
						data={d202004}
						layout="vertical"
						margin={{
							top: 20,
							right: 30,
							left: 20,
							bottom: 5
						}}
					>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis type="number" dataKey="value" />
						<YAxis type="category" dateKey="key" />
						<Tooltip />
						<Bar dataKey="value" fill="#8884d8" label="value" />
					</BarChart>
				</ResponsiveContainer>
				<div id="simulteurs-indicators"></div>
			</section>

			<section>
				<h2> Statut choisi le dernier mois</h2>
				<ResponsiveContainer width="100%" height={300}>
					<BarChart
						data={stats.status_chosen}
						layout="vertical"
						margin={{
							top: 20,
							right: 30,
							left: 20,
							bottom: 5
						}}
					>
						<CartesianGrid strokeDasharray="3 3" />
						<YAxis dy={-5} type="category" dataKey="label" />
						<XAxis type="number" dateKey="nb_visits" />
						<Tooltip />
						<Bar dataKey="nb_visits" fill="#8884d8" />
					</BarChart>
				</ResponsiveContainer>
				<div id="status-indicators"></div>
			</section>
		</>
	)
}
