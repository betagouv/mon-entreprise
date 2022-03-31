import Conversation from '@/components/conversation/Conversation'
import Value, { WhenAlreadyDefined } from '@/components/EngineValue'
import { FromBottom, FromTop } from '@/components/ui/animate'
import Progress from '@/components/ui/Progress'
import { useSimulationProgress } from '@/components/utils/useNextQuestion'
import { Message } from '@/design-system'
import { Container, Spacing } from '@/design-system/layout'
import { Strong } from '@/design-system/typography'
import { H2 } from '@/design-system/typography/heading'
import { Body, Intro } from '@/design-system/typography/paragraphs'
import { Grid } from '@mui/material'

export default function Cotisations() {
	const progress = useSimulationProgress()

	return (
		<FromTop>
			<Grid container item lg={10} xl={8}>
				<Intro>
					En 2022, vous paierez des <Strong>cotisations sociales</Strong> à
					l'Urssaf. Voici comment elles seront calculées :
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
						<H2>Cotisations provisionnelles</H2>
						<Intro>
							<Value expression="dirigeant . indépendant . cotisations et contributions" />
						</Intro>
						<Body>
							En 2022, vous allez payer chaque mois une{' '}
							<Strong>avance sur le montant des cotisations</Strong> que vous
							devrez . C'est ce que l'on appelle{' '}
							<Strong>les cotisations provisionnelles</Strong>. Elles sont
							calculées à partir de votre revenu de 2021 (déclaré en 2022).
						</Body>
						<Body>
							Ces cotisations seront <Strong>régularisées en 2023</Strong>, une
							fois que l'Urssaf connaîtra votre revenu réel de 2022.
						</Body>
					</Grid>
					<Grid item md={6} sm={12}>
						<H2>Régularisation des cotisations</H2>
						<Intro>
							<Value expression="DRI . cotisations . régularisation" />
						</Intro>
						<Body>
							C'est la différence entre les cotisations provisionnelles payées
							en 2021 et le montant que vous deviez effectivement payer.
						</Body>
						<Body>
							Ce dernier est calculé à partir de votre revenu de 2021 (déclaré
							en 2022).
						</Body>
					</Grid>
					<Grid item lg={10} xl={8}>
						<Spacing md />
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
							</div>
						</Message>
					</Grid>
					<Grid item lg={10} xl={8}>
						<WhenAlreadyDefined dottedName="DRI . cotisations">
							<FromBottom>
								<Message icon type="success" border={false}>
									<Intro>
										En 2022, vous devrez payer à l'Urssaf{' '}
										<Strong>
											{' '}
											<Value expression="DRI . cotisations" />
										</Strong>{' '}
										de cotisations sociales.
									</Intro>
								</Message>
							</FromBottom>
						</WhenAlreadyDefined>
					</Grid>
				</Grid>
				<Spacing md />
			</Container>
			<Progress progress={progress} />
		</FromTop>
	)
}
