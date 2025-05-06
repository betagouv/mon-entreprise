import { useTranslation } from 'react-i18next'

import { Message } from '@/design-system'
import { Emoji } from '@/design-system/emoji'
import { Grid } from '@/design-system/layout'
import { Strong } from '@/design-system/typography'
import { H2 } from '@/design-system/typography/heading'
import { Body, Intro } from '@/design-system/typography/paragraphs'

import { useStatistiques } from '../useStatistiques'
import {
	emojiSatisfaction,
	formatIndicator,
	formatMonth,
	formatProgression,
	messageTypeSatisfaction,
} from './utils'

export function MainIndicators({
	questionsRépondues,
	satisfaction,
}: {
	questionsRépondues: ReturnType<typeof useStatistiques>['questionsRépondues']
	satisfaction: ReturnType<typeof useStatistiques>['satisfaction']
}) {
	const lastMonth = questionsRépondues.at(-2) || questionsRépondues.at(-1)
	const { language } = useTranslation().i18n
	if (!lastMonth) {
		return null
	}

	const lastYear = questionsRépondues.at(-13)
	const formattedProgression =
		lastYear &&
		!!lastYear.nombre.questions_répondues &&
		formatProgression(
			lastYear.nombre.questions_répondues,
			lastMonth.nombre.questions_répondues,
			language
		)
	const satisfactionLastMonth = satisfaction.at(-2) || satisfaction.at(-1)

	return (
		<>
			<H2>Notre impact en {formatMonth(lastMonth.date, language)}</H2>
			<Grid container spacing={4} role="list">
				<Grid item xs={12} md={6} role="listitem">
					<Message border={false} icon={<Emoji emoji="🛎️" />}>
						<Intro>
							<Strong>
								{formatIndicator(
									lastMonth.nombre.questions_répondues,
									language
								)}
							</Strong>{' '}
							questions répondues
						</Intro>
						{formattedProgression && (
							<Body>
								<Strong>{formattedProgression}</Strong> en un an
							</Body>
						)}
					</Message>
				</Grid>
				{satisfactionLastMonth && (
					<Grid item xs={12} md={6} role="listitem">
						<Message
							border={false}
							type={messageTypeSatisfaction(satisfactionLastMonth.moyenne)}
							icon={
								<Emoji
									emoji={emojiSatisfaction(satisfactionLastMonth.moyenne)}
								/>
							}
						>
							<Intro>
								<Strong>
									{Intl.NumberFormat(language, {
										style: 'percent',
									}).format(satisfactionLastMonth?.moyenne ?? 0)}
								</Strong>{' '}
								de satisfaction
							</Intro>
							<Body>
								Moyenne des{' '}
								<Strong>{satisfactionLastMonth?.nbAvisMoyenne}</Strong> avis
								reçus
								{satisfactionLastMonth?.nbMoisMoyenne === 1
									? ` en ${formatMonth(lastMonth.date, language)}`
									: ` sur les ${satisfactionLastMonth?.nbMoisMoyenne} derniers mois`}
							</Body>
						</Message>
					</Grid>
				)}
			</Grid>
		</>
	)
}
