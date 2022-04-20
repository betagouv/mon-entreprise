import Conversation from '@/components/conversation/Conversation'
import Value, { Condition, WhenAlreadyDefined } from '@/components/EngineValue'
import PageFeedback from '@/components/Feedback'
import { FromTop } from '@/components/ui/animate'
import Progress from '@/components/ui/Progress'
import { useEngine } from '@/components/utils/EngineContext'
import { Markdown } from '@/components/utils/markdown'
import { useSimulationProgress } from '@/components/utils/useNextQuestion'
import { Message } from '@/design-system'
import { Container, Spacing } from '@/design-system/layout'
import { Strong } from '@/design-system/typography'
import { H2, H3 } from '@/design-system/typography/heading'
import { Body, Intro } from '@/design-system/typography/paragraphs'
import { Grid } from '@mui/material'
import { SimpleField } from '../_components/Fields'
import { DéclarationRevenu } from './_components/DéclarationRevenu'

export default function Cotisations() {
	const progress = useSimulationProgress()
	const engine = useEngine()

	return (
		<FromTop>
			<Grid container spacing={4}>
				<Grid item lg={10} xl={8}>
					<Intro>
						En 2022, vous paierez des <Strong>cotisations sociales</Strong> à
						l'Urssaf. Pour avoir une première estimation de leur montant, il
						vous reste une dernière question à répondre :
					</Intro>
					<SimpleField dottedName="DRI . cotisations . appelées en 2021" />
				</Grid>
			</Grid>
			<Spacing lg />
			<WhenAlreadyDefined dottedName="DRI . cotisations . appelées en 2021">
				<Container
					darkMode
					backgroundColor={(theme) => theme.colors.bases.primary[600]}
				>
					<FromTop>
						<Grid container columnSpacing={4} rowSpacing={2}>
							<Grid item lg={10} xl={8}>
								<FromTop>
									<H2>Estimation des cotisations à payer</H2>
									<Body>
										Voici votre estimation personalisée, calculée sur la base
										des éléments renseignées sur la déclaration de revenu de la
										page précédente :
									</Body>
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

									<Intro>
										Améliorez cette estimation en répondant aux questions
										suivantes pour l'année 2021
									</Intro>
									<Message border={false}>
										<div
											css={`
												margin: -0.75rem 0;
											`}
										>
											<Conversation
												customSituationVisualisation={
													<>
														<Grid container>
															<DéclarationRevenu editable />
														</Grid>
													</>
												}
											/>
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
								</FromTop>
							</Grid>
							<Grid item md={6} sm={12}>
								<H3>
									{engine.getRule('DRI . cotisations . provisionnelles').title}
								</H3>
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
								<H3>
									{engine.getRule('DRI . cotisations . régularisation').title}
								</H3>
								<Intro>
									<Value expression="DRI . cotisations . régularisation" />
								</Intro>
								<Markdown>
									{engine.getRule('DRI . cotisations . régularisation').rawNode
										.description ?? ''}
								</Markdown>{' '}
							</Grid>
						</Grid>
						<Spacing md />
					</FromTop>
				</Container>

				<Container
					backgroundColor={(theme) => theme.colors.bases.tertiary[100]}
				>
					<PageFeedback customMessage="Qu'avez-vous pensé de cet assistant ?" />
				</Container>
			</WhenAlreadyDefined>
		</FromTop>
	)
}
