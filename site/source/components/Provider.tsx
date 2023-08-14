import { OverlayProvider } from '@react-aria/overlays'
import { ErrorBoundary } from '@sentry/react'
import i18next from 'i18next'
import { createContext, ReactNode } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { I18nextProvider, Trans, useTranslation } from 'react-i18next'
import { Provider as ReduxProvider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import logo from '@/assets/images/logo-monentreprise.svg'
import FeedbackForm from '@/components/Feedback/FeedbackForm'
import { ThemeColorsProvider } from '@/components/utils/colors'
import { DisableAnimationOnPrintProvider } from '@/components/utils/DisableAnimationContext'
import { Container, Grid } from '@/design-system/layout'
import DesignSystemThemeProvider from '@/design-system/root'
import { H1, H4 } from '@/design-system/typography/heading'
import { Link } from '@/design-system/typography/link'
import { Body, Intro } from '@/design-system/typography/paragraphs'
import { EmbededContextProvider } from '@/hooks/useIsEmbedded'

import { Message } from '../design-system'
import * as safeLocalStorage from '../storage/safeLocalStorage'
import { store } from '../store/store'
import { TrackingContext } from './ATInternetTracking'
import { createTracker } from './ATInternetTracking/Tracker'
import { IframeResizer } from './IframeResizer'
import { ServiceWorker } from './ServiceWorker'
import { DarkModeProvider } from './utils/DarkModeContext'

type SiteName = 'mon-entreprise' | 'infrance' | 'publicodes'

export const SiteNameContext = createContext<SiteName | null>(null)

export type ProviderProps = {
	basename: SiteName
	children: ReactNode
}

export default function Provider({
	basename,
	children,
}: ProviderProps): JSX.Element {
	return (
		<EmbededContextProvider>
			<DarkModeProvider>
				<DesignSystemThemeProvider>
					<ErrorBoundary
						// eslint-disable-next-line react/jsx-props-no-spreading
						fallback={(errorData) => <ErrorFallback {...errorData} />}
					>
						<I18nextProvider i18n={i18next}>
							<ReduxProvider store={store}>
								<BrowserRouterProvider basename={basename}>
									<ErrorBoundary
										fallback={(errorData) => (
											// eslint-disable-next-line react/jsx-props-no-spreading
											<ErrorFallback {...errorData} showFeedbackForm />
										)}
									>
										{!import.meta.env.SSR &&
											import.meta.env.MODE === 'production' &&
											'serviceWorker' in navigator && <ServiceWorker />}
										<IframeResizer />
										<OverlayProvider>
											<ThemeColorsProvider>
												<DisableAnimationOnPrintProvider>
													<SiteNameContext.Provider value={basename}>
														{children}
													</SiteNameContext.Provider>
												</DisableAnimationOnPrintProvider>
											</ThemeColorsProvider>
										</OverlayProvider>
									</ErrorBoundary>
								</BrowserRouterProvider>
							</ReduxProvider>
						</I18nextProvider>
					</ErrorBoundary>
				</DesignSystemThemeProvider>
			</DarkModeProvider>
		</EmbededContextProvider>
	)
}

const ErrorFallback = (props: {
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
		<main style={{ height: '100vh' }}>
			<Container>
				<Link
					href="/"
					aria-label={t('error.back', "Retourner à la page d'accueil")}
				>
					<img
						src={logo}
						alt="Logo mon-entreprise"
						style={{
							maxWidth: '200px',
							width: '100%',
							marginTop: '1rem',
						}}
					></img>
				</Link>
				<H1>
					<Trans i18nKey="error.title">Une erreur est survenue</Trans>
				</H1>
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
											pouvez décrire les actions ont conduit à cette erreur via
											le formulaire ci-dessous ou à l'adresse :{' '}
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
									Si vous souhaitez nous aider à corriger ce problème, vous
									pouvez décrire les actions ont conduit à cette erreur à
									l'adresse :{' '}
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
			</Container>
		</main>
	)
}

function BrowserRouterProvider({
	children,
	basename,
}: {
	children: ReactNode
	basename: string
}) {
	// The server router is only provided in the entry-server file
	if (import.meta.env.SSR) {
		return <>{children}</>
	}

	const ATTracker = createTracker(
		import.meta.env.VITE_AT_INTERNET_SITE_ID,
		safeLocalStorage.getItem('tracking:do_not_track') === '1' ||
			navigator.doNotTrack === '1'
	)

	return (
		<HelmetProvider>
			<TrackingContext.Provider
				value={
					new ATTracker({
						language: i18next.language as 'fr' | 'en',
					})
				}
			>
				<BrowserRouter
					basename={import.meta.env.MODE === 'production' ? '' : basename}
					future={{ v7_startTransition: true }}
				>
					{children}
				</BrowserRouter>
			</TrackingContext.Provider>
		</HelmetProvider>
	)
}
