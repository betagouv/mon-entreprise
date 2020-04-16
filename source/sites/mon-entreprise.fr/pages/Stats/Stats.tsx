import { ThemeColorsContext } from 'Components/utils/colors'
import { ScrollToTop } from 'Components/utils/Scroll'
import React, { useContext, useState } from 'react'
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
import { formatPercentage } from '../../../../../source/engine/format'
import MoreInfosOnUs from 'Components/MoreInfosOnUs'
import Privacy from '../../layout/Footer/Privacy'
import statsJson from '../../../../data/stats.json'
import Value from 'Components/Value'
import { animated, config, useSpring } from 'react-spring'
import useDisplayOnIntersecting from 'Components/utils/useDisplayOnIntersecting'
const ANIMATION_SPRING = config.gentle

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
}
let ChartItemBar = ({ styles, color, visitors }) => (
	<div className="distribution-chart__bar-container">
		<animated.div
			className="distribution-chart__bar"
			style={{
				backgroundColor: color,
				flex: styles.flex
			}}
		/>
		<div
			css={`
				font-weight: bold;
				margin-left: 1rem;
				color: var(--textColorOnWhite);
			`}
		>
			<Value maximumFractionDigits={0} unit="visiteurs">
				{visitors}
			</Value>
		</div>
	</div>
)
let BranchIcône = ({ icône }) => (
	<div className="distribution-chart__legend">
		<span className="distribution-chart__icon">{emoji(icône)}</span>
	</div>
)

type DistributionBranchProps = {
	page: { label: string; nb_visits: number }
	title: string
	description?: string
	icon?: string
	total: number
}

const Simulateurs = {
	'/salarié': {
		name: 'Salarié',
		description:
			"Calculer le salaire net, brut, ou total d'un salarié, stagiaire,ou assimilé",
		icone: '🤝'
	},
	'/auto-entrepreneur': {
		name: 'Auto-entrepreneur',
		description:
			"Calculer le revenu (ou le chiffre d'affaires) d'un auto-entrepreneur",
		icone: '🚶‍♂️'
	},
	'/artiste-auteur': {
		name: 'Artiste-auteur',
		description: "Estimer les cotisations sociales d'un artiste ou auteur",
		icone: '👩‍🎨'
	},
	'/indépendant': {
		name: 'Indépendant',
		description:
			"Calculer le revenu d'un dirigeant de EURL, EI, ou SARL majoritaire",
		icone: '👩‍🔧'
	},
	'/assimilé-salarié': {
		name: 'Assimilé salarié',
		description:
			"Calculer le revenu d'un dirigeant de SAS, SASU ou SARL minoritaire",
		icone: '☂️'
	},
	'/comparaison-régimes-sociaux': {
		name: 'Comparaison status',
		description:
			'Simulez les différences entre les régimes (cotisations,retraite, maternité, maladie, etc.)',
		icone: '📊'
	}
}

export function DistributionBranch({
	page,
	title,
	description,
	icon,
	total
}: DistributionBranchProps) {
	const [intersectionRef, brancheInViewport] = useDisplayOnIntersecting({
		threshold: 0.5
	})
	const { color } = useContext(ThemeColorsContext)
	const visitors = brancheInViewport ? page.nb_visits : 0
	const styles = useSpring({
		config: ANIMATION_SPRING,
		to: {
			flex: visitors / total,
			opacity: visitors ? 1 : 0
		}
	}) as { flex: number; opacity: number }

	return (
		<animated.div
			ref={intersectionRef}
			className="distribution-chart__item"
			style={{ opacity: styles.opacity }}
		>
			<BranchIcône icône={icon} />
			<div className="distribution-chart__item-content">
				<p className="distribution-chart__counterparts">
					<span className="distribution-chart__branche-name">{title}</span>
					<br />
					<small>{description}</small>
				</p>
				<ChartItemBar
					{...{
						styles,
						color,
						visitors,
						total
					}}
				/>
			</div>
		</animated.div>
	)
}

export default function Stats() {
	const [choice, setChoice] = useState<LineChartVisitsProps['periodicity']>(
		'monthly'
	)
	const { color } = useContext(ThemeColorsContext)

	return (
		<>
			<ScrollToTop />
			<h1>
				Statistiques <>{emoji('📊')}</>
			</h1>
			<p>
				Découvrez nos statistiques d'utilisation mises à jour en temps réel. Les
				données recueillies sont anonymisées. <Privacy label="En savoir plus" />
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
						<option value="daily"> les derniers jours</option>
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
				<h2>Nombre d'utilisation des simulateurs</h2>
				{stats.simulators.currentmonth.visites.map(x => (
					<DistributionBranch
						page={x}
						title={Simulateurs[x.label].name}
						description={Simulateurs[x.label].description}
						icon={Simulateurs[x.label].icone}
						total={stats.simulators.currentmonth.visites.reduce(
							(a, b) => Math.max(a, b.nb_visits),
							0
						)}
					/>
				))}
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
				<h2>Statut choisi le dernier mois</h2>
				<ResponsiveContainer width="100%" height={300}>
					<BarChart
						data={stats.status_chosen}
						layout="vertical"
						margin={{
							top: 20,
							right: 30,
							left: 150,
							bottom: 5
						}}
					>
						<CartesianGrid strokeDasharray="3 3" />
						<YAxis type="category" dataKey="label" />
						<XAxis type="number" dataKey="nb_visits" />
						<Tooltip />
						<Bar dataKey="nb_visits" fill={color}></Bar>
					</BarChart>
				</ResponsiveContainer>
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

function LineChartVisits({ periodicity }) {
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
				<XAxis dataKey="date" />
				<YAxis />
				<Tooltip />
				<Line
					type="monotone"
					dataKey="visiteurs"
					stroke={color}
					strokeWidth={3}
				/>
			</LineChart>
		</ResponsiveContainer>
	)
}
