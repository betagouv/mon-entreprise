import { useTranslation } from 'react-i18next'

import { Message } from '@/design-system'
import { Emoji } from '@/design-system/emoji'
import { Grid } from '@/design-system/layout'
import { Strong } from '@/design-system/typography'
import { H2 } from '@/design-system/typography/heading'
import { Body, Intro } from '@/design-system/typography/paragraphs'

import { QuestionRépondues, Satisfaction, Visites } from '../types'
import {
	emojiSatisfaction,
	formatIndicator,
	messageTypeSatisfaction,
} from './utils'

export function LastYearIndicator({
	questionsRépondues,
	satisfaction,
	visitesMois,
}: {
	questionsRépondues: QuestionRépondues
	visitesMois: Visites
	satisfaction: Satisfaction
}) {
	const lastYear = questionsRépondues.at(-13)
	const language = useTranslation().i18n.language

	if (!lastYear) {
		return null
	}

	const questionsRéponduesLastYear = questionsRépondues
		.filter(({ date }) => date.startsWith(lastYear.date.slice(0, 4)))
		.reduce((acc, { nombre }) => acc + nombre.questions_répondues, 0)

	const [visitesLastYear, simulationCommenceeLastYear] = visitesMois
		.filter(({ date }) => date.startsWith(lastYear.date.slice(0, 4)))
		.reduce(
			([acc0, acc1], { nombre }) => [
				acc0 + nombre.accueil,
				acc1 + nombre.simulation_commencee,
			],
			[0, 0]
		)
	const conversionRate = Intl.NumberFormat(language, {
		style: 'percent',
	}).format(simulationCommenceeLastYear / visitesLastYear)

	const cumulSatisfaction = satisfaction
		.filter(({ date }) => date.startsWith(lastYear.date.slice(0, 4)))
		.reduce(
			(acc, { positif, total }) => ({
				total: acc.total + (total ?? 0),
				positif: acc.positif + (positif ?? 0),
			}),
			{ total: 0, positif: 0 }
		)
	const satisfactionRate = cumulSatisfaction.positif / cumulSatisfaction.total
	const formattedSatisfactionRate = Intl.NumberFormat(language, {
		style: 'percent',
	}).format(satisfactionRate)

	return (
		<>
			<H2>Retour sur l'année {lastYear.date.slice(0, 4)}</H2>
			<Grid container columnSpacing={4} role="list">
				<Grid item xs={12} sm={6} md={4} role="listitem">
					<Message border={false} icon={<Emoji emoji="🛎️" />}>
						<Intro>
							<Strong>
								{formatIndicator(questionsRéponduesLastYear, language)}
							</Strong>{' '}
							questions répondues
						</Intro>
					</Message>
				</Grid>
				<Grid item xs={12} sm={6} md={4} role="listitem">
					<Message
						border={false}
						icon={<Emoji emoji={emojiSatisfaction(satisfactionRate)} />}
						type={messageTypeSatisfaction(satisfactionRate)}
					>
						<Intro>
							<Strong>{formattedSatisfactionRate}</Strong> taux de satisfaction
						</Intro>
					</Message>
				</Grid>

				<Grid item xs={12} sm={6} md={4} role="listitem">
					<Message border={false} icon={<Emoji emoji="🏇" />}>
						<Intro>
							<Strong>{conversionRate}</Strong> taux de conversion
						</Intro>
					</Message>
				</Grid>

				<Grid item xs={12} sm={6} md={4} role="listitem">
					<Message border={false} icon={<Emoji emoji="📈" />}>
						<Body>
							<Strong>{formatIndicator(visitesLastYear, language)}</Strong>{' '}
							visites
						</Body>
					</Message>
				</Grid>
				<Grid item xs={12} sm={6} md={4} role="listitem">
					<Message
						border={false}
						icon={<Emoji emoji="👋" />}
						type={
							cumulSatisfaction.total < 20
								? 'error'
								: cumulSatisfaction.total < 100
								? 'info'
								: 'primary'
						}
					>
						<Body>
							<Strong>
								{formatIndicator(cumulSatisfaction.total, language)}
							</Strong>{' '}
							avis collectés
						</Body>
					</Message>
				</Grid>
			</Grid>
		</>
	)
}
