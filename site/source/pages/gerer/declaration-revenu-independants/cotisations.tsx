import Conversation from '@/components/conversation/Conversation'
import Value, { Condition, WhenAlreadyDefined } from '@/components/EngineValue'
import PageFeedback from '@/components/Feedback'
import { Appear, FromTop } from '@/components/ui/animate'
import Progress from '@/components/ui/Progress'
import { useEngine } from '@/components/utils/EngineContext'
import { Markdown } from '@/components/utils/markdown'
import { useSimulationProgress } from '@/components/utils/useNextQuestion'
import { Message } from '@/design-system'
import { Container, Spacing } from '@/design-system/layout'
import { Strong } from '@/design-system/typography'
import { H2 } from '@/design-system/typography/heading'
import { Intro } from '@/design-system/typography/paragraphs'
import { Grid } from '@mui/material'

export default function Cotisations() {
	const progress = useSimulationProgress()
	const engine = useEngine()

	return (
		<FromTop>
			<Grid container item lg={10} xl={8}>
				<Intro>
					En 2022, vous paierez des <Strong>cotisations sociales</Strong> à
					l'Urssaf. Voici une estimation personalisée de leur montant :
				</Intro>
			</Grid>
			<Container
				darkMode
				backgroundColor={(theme) => theme.colors.bases.primary[600]}
			>
				<Grid
					container
					columnSpacing={4}
					rowSpacing={2}
					justifyContent="center"
				>
					<Grid item md={6} sm={12}>
						<H2>
							{engine.getRule('DRI . cotisations . provisionnelles').title}
						</H2>
						<Intro>
							<Value
								expression="dirigeant . indépendant . cotisations et contributions"
								displayedUnit="€"
							/>
						</Intro>
						<Markdown>
							{engine.getRule('DRI . cotisations . provisionnelles').rawNode
								.description ?? ''}
						</Markdown>{' '}
					</Grid>
					<Grid item md={6} sm={12}>
						<H2>
							{engine.getRule('DRI . cotisations . régularisation').title}
						</H2>
						<Intro>
							<Value expression="DRI . cotisations . régularisation" />
						</Intro>
						<Markdown>
							{engine.getRule('DRI . cotisations . régularisation').rawNode
								.description ?? ''}
						</Markdown>{' '}
					</Grid>
					<Grid item lg={10} xl={8}>
						<WhenAlreadyDefined dottedName="DRI . cotisations">
							<Appear>
								<Message icon border={false}>
									<Intro>
										<Condition expression="DRI . cotisations >= 0">
											En 2022, vous devrez payer à l'Urssaf{' '}
											<Strong>
												{' '}
												<Value expression="DRI . cotisations" />
											</Strong>{' '}
											de cotisations sociales.
										</Condition>
										<Condition expression="DRI . cotisations < 0">
											En 2022, l'Urssaf vous remboursera{' '}
											<Strong>
												{' '}
												<Value expression="DRI . cotisations * -1" />
											</Strong>{' '}
										</Condition>
									</Intro>
								</Message>
							</Appear>
						</WhenAlreadyDefined>
					</Grid>
					<Grid item lg={10} xl={8}>
						<Intro as="h2">
							Améliorez votre estimation en répondant aux questions suivantes
							pour l'année 2021
						</Intro>
					</Grid>
					<Grid item lg={10} xl={8}>
						<Message border={false}>
							<div
								css={`
									margin: -0.75rem 0;
								`}
							>
								<Conversation />
								<div
									css={`
										position: relative;
										top: -2px;
										margin: 0 -1.5rem;
									`}
								>
									<Progress progress={progress} />
								</div>
							</div>
						</Message>
					</Grid>
				</Grid>
				<Spacing md />
			</Container>

			<Container backgroundColor={(theme) => theme.colors.bases.tertiary[100]}>
				<PageFeedback customMessage="Qu'avez-vous pensé de cet assistant ?" />
			</Container>
		</FromTop>
	)
}
