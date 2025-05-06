import { ReactNode } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import FeedbackForm from '@/components/Feedback/FeedbackForm'
import { Container, Grid } from '@/design-system/layout'
import { H1, H4 } from '@/design-system/typography/heading'
import { Link } from '@/design-system/typography/link'
import { Body, Intro } from '@/design-system/typography/paragraphs'

import { Message } from '../design-system'
import { Logo } from './Logo'

const StyledLogo = styled.div`
	height: 3rem;

	@media (max-width: ${({ theme }) => theme.breakpointsWidth.sm}) {
		height: 2.5rem;
	}
`

export const ErrorLayout = ({ children }: { children: ReactNode }) => {
	const { t } = useTranslation()

	return (
		<main style={{ height: '100vh' }}>
			<Container>
				<Link
					href="/"
					aria-label={t('error.back', "Retourner à la page d'accueil")}
				>
					<StyledLogo>
						<Logo />
					</StyledLogo>
				</Link>

				<H1>
					<Trans i18nKey="error.title">Une erreur est survenue</Trans>
				</H1>

				{children}
			</Container>
		</main>
	)
}

export const ErrorFallback = (props: {
	error: Error
	componentStack: string | null
	eventId: string | null
	resetError(): void
	showFeedbackForm?: boolean
}) => {
	const { t } = useTranslation()

	const additionalData = JSON.stringify(
		{
			name: props.error.name,
			message: props.error.message,
			stack: props.error.stack,
			componentStack: props.componentStack,
		},
		null,
		2
	)

	return (
		<ErrorLayout>
			<Intro>
				<Trans i18nKey="error.intro">
					L'équipe technique mon-entreprise a été prévenue automatiquement,
					veuillez nous excuser pour la gêne occasionnée.
				</Trans>
			</Intro>
			<Grid container spacing={3}>
				<Grid item xs={12} lg={8}>
					{props.showFeedbackForm ? (
						<FeedbackForm
							infoSlot={
								<Trans i18nKey="error.body0">
									<Body>
										Si vous souhaitez nous aider à corriger ce problème, vous
										pouvez décrire les actions ont conduit à cette erreur via le
										formulaire ci-dessous ou à l'adresse :{' '}
										<Link
											href="mailto:contact@mon-entreprise.beta.gouv.fr"
											aria-label={t(
												'error.contact',
												'Envoyer un courriel à contact@mon-entreprise.beta.gouv.fr, nouvelle fenêtre'
											)}
										>
											contact@mon-entreprise.beta.gouv.fr
										</Link>
										.
									</Body>
								</Trans>
							}
							description={
								<Trans i18nKey="error.description">
									Décrivez les actions qui ont conduit à cette erreur :
								</Trans>
							}
							placeholder={t(
								'error.placeholder',
								`Bonjour, j'ai rencontré une erreur après avoir cliqué sur...`
							)}
							tags={['error']}
							additionalData={additionalData}
						/>
					) : (
						<Trans i18nKey="error.body1">
							<Body>
								Si vous souhaitez nous aider à corriger ce problème, vous pouvez
								décrire les actions ont conduit à cette erreur à l'adresse :{' '}
								<Link
									href="mailto:contact@mon-entreprise.beta.gouv.fr"
									aria-label={t(
										'error.contact',
										'Envoyer un courriel à contact@mon-entreprise.beta.gouv.fr, nouvelle fenêtre'
									)}
								>
									contact@mon-entreprise.beta.gouv.fr
								</Link>
								.
							</Body>
						</Trans>
					)}
				</Grid>

				<Grid item xs={12} lg={8}>
					<Message type="info">
						<H4>Cause de l'erreur :</H4>
						<Body>
							{props.error.name} : {props.error.message}
						</Body>
					</Message>
				</Grid>
			</Grid>
		</ErrorLayout>
	)
}
