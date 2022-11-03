import { useTranslation } from 'react-i18next'

import Emoji from '@/components/utils/Emoji'
import { Grid, Spacing } from '@/design-system/layout'
import { Link } from '@/design-system/typography/link'

import { SatisfactionStyle } from './SatisfactionChart'
import { SatisfactionLevel, StatsStruct } from './types'
import { Indicator, IndicatorProps } from './utils'

const add = (a: number, b: number) => a + b
const lastCompare = (startDate: Date, dateStr: string) =>
	startDate < new Date(dateStr)

export const BigIndicator = ({ main, subTitle, footnote }: IndicatorProps) => (
	<Grid item xs={6} md={4} lg={3}>
		<Indicator main={main} subTitle={subTitle} footnote={footnote} />
	</Grid>
)

const RetoursAsProgress = ({
	percentages,
}: {
	percentages: Record<SatisfactionLevel, number>
}) => (
	<div
		className="progress__container"
		css={`
			width: 100%;
			overflow: hidden;
			height: 2.5rem;
			border-radius: 3px;
			margin-top: 1rem;
			margin-bottom: 2.5rem;
			display: flex;
			font-size: 1.8rem;
		`}
	>
		{' '}
		{SatisfactionStyle.map(([level, { emoji: emojiStr, color }]) => (
			<div
				key={level}
				css={`
					width: ${percentages[level]}%;
					background-color: ${color};
					display: flex;
					align-items: center;
					justify-content: center;
				`}
			>
				<Emoji emoji={emojiStr} />
				<div
					css={`
						position: absolute;
						margin-top: 4rem;
						font-size: 0.7rem;
						font-weight: lighter;
					`}
				>
					{Math.round(percentages[level])}%
				</div>
			</div>
		))}
	</div>
)

export default function GlobalStats({ stats }: { stats: StatsStruct }) {
	const { i18n } = useTranslation()
	const formatNumber = Intl.NumberFormat(i18n.language).format.bind(null)

	const totalVisits = formatNumber(
		stats.visitesMois.site.map(({ nombre }) => nombre).reduce(add, 0)
	)
	const totalCommenceATI = stats.visitesMois.pages
		.filter(({ page }) => page === 'simulation_commencee')
		.map(({ nombre }) => nombre)
		.reduce(add, 0)
	// Hardcoded stuff from https://github.com/betagouv/mon-entreprise/pull/1563#discussion_r635893624
	const totalCommenceMatomo = Object.values({
		2019: Math.floor((1262601 * 45) / 100),
		2020: 1373536,
		2021: 273731,
	}).reduce(add, 0)
	const totalCommence = formatNumber(totalCommenceMatomo + totalCommenceATI)

	const day30before = new Date(new Date().setDate(new Date().getDate() - 30))

	const last30dVisitsNum = stats.visitesJours.site
		.filter(({ date }) => lastCompare(day30before, date))
		.map(({ nombre }) => nombre)
		.reduce(add, 0)
	const last30dVisits = formatNumber(last30dVisitsNum)
	const last30dCommenceNum = stats.visitesJours.pages
		.filter(
			({ date, page }) =>
				lastCompare(day30before, date) && page === 'simulation_commencee'
		)
		.map(({ nombre }) => nombre)
		.reduce(add, 0)
	const last30dCommence = formatNumber(last30dCommenceNum)
	const last30dConv = Math.round((100 * last30dCommenceNum) / last30dVisitsNum)

	const currentMonthSatisfaction = (() => {
		const currentMonthSatisfaction = stats.satisfaction
			.filter(({ month }) =>
				month.startsWith(new Date().toISOString().slice(0, 7))
			)
			.reduce(
				(acc, { click: satisfactionLevel, nombre }) => ({
					...acc,
					[satisfactionLevel]: acc[satisfactionLevel] + nombre,
				}),
				{
					[SatisfactionLevel.Mauvais]: 0,
					[SatisfactionLevel.Moyen]: 0,
					[SatisfactionLevel.Bien]: 0,
					[SatisfactionLevel.TrèsBien]: 0,
				}
			)

		const total = Object.values(currentMonthSatisfaction).reduce(
			(a, b) => a + b
		)

		return {
			total,
			percentages: Object.fromEntries(
				Object.entries(currentMonthSatisfaction).map(([level, count]) => [
					level,
					(100 * count) / total,
				])
			) as Record<SatisfactionLevel, number>,
		}
	})()

	return (
		<>
			<Grid container spacing={2}>
				<BigIndicator
					main={`${last30dConv} %`}
					subTitle="Taux de conversion"
					footnote="visites avec une simulation"
				/>
				<BigIndicator
					main={last30dVisits}
					subTitle="Visites"
					footnote="sur les 30 derniers jours"
				/>
				<BigIndicator
					main={last30dCommence}
					subTitle="Simulations lancées"
					footnote="sur les 30 derniers jours"
				/>
				<BigIndicator
					main={stats.nbAnswersLast30days}
					subTitle="Réponses aux utilisateurs"
					footnote={
						<>
							sur les 30 derniers jours.{' '}
							<Link to="#demandes-utilisateurs">
								Voir les demandes populaires
							</Link>
						</>
					}
				/>

				{currentMonthSatisfaction.total > 0 && (
					<Grid item xs={12} md={8} lg={12}>
						<Indicator
							subTitle="Satisfaction utilisateurs"
							main={
								<>
									<RetoursAsProgress
										percentages={currentMonthSatisfaction.percentages}
									/>{' '}
								</>
							}
							footnote={`${currentMonthSatisfaction.total} avis ce mois ci`}
						/>
					</Grid>
				)}
			</Grid>

			<Spacing md />

			<Grid container spacing={2}>
				<BigIndicator
					main={totalVisits}
					subTitle="Visites"
					footnote="depuis le 1ᵉ janvier 2019"
				/>
				<BigIndicator
					main={totalCommence}
					subTitle="Simulations lancées"
					footnote="depuis le 1ᵉ janvier 2019"
				/>
			</Grid>
		</>
	)
}
