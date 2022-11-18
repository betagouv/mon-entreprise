import { OverlayProvider } from '@react-aria/overlays'
import { ErrorBoundary } from '@sentry/react'
import i18next from 'i18next'
import { ReactNode, createContext } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { I18nextProvider, useTranslation } from 'react-i18next'
import { Provider as ReduxProvider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import { DisableAnimationOnPrintProvider } from '@/components/utils/DisableAnimationContext'
import { ThemeColorsProvider } from '@/components/utils/colors'
import { GlobalStyle } from '@/design-system/global-style'
import { Container } from '@/design-system/layout'
import DesignSystemThemeProvider from '@/design-system/root'
import { H1 } from '@/design-system/typography/heading'
import { Link } from '@/design-system/typography/link'
import { Body, Intro } from '@/design-system/typography/paragraphs'
import { useIframeResizer } from '@/hooks/useIframeResizer'
import logo from '@/images/logo-monentreprise.svg'

// ATInternet Tracking
import { TrackingContext } from './ATInternetTracking'
import { createTracker } from './ATInternetTracking/Tracker'
import { ServiceWorker } from './ServiceWorker'
import { DarkModeProvider } from './contexts/DarkModeContext'
import * as safeLocalStorage from './storage/safeLocalStorage'
import { store } from './store'
import { inIframe } from './utils'

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
	useIframeResizer()

	const { t } = useTranslation()

	return (
		<DarkModeProvider>
			<DesignSystemThemeProvider>
				<GlobalStyle />
				<ErrorBoundary
					showDialog
					fallback={
						<Container>
							<Link href="/" aria-label={t("Retourner à la page d'accueil")}>
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
							<H1>Une erreur est survenue</H1>
							<Intro>
								L'équipe technique mon-entreprise a été automatiquement
								prévenue.
							</Intro>
							<Body>
								Vous pouvez également nous contacter directement à l'adresse{' '}
								<Link href="mailto:contact@mon-entreprise.beta.gouv.fr">
									contact@mon-entreprise.beta.gouv.fr
								</Link>{' '}
								si vous souhaitez partager une remarque. Veuillez nous excuser
								pour la gêne occasionnée.
							</Body>
						</Container>
					}
				>
					{!import.meta.env.SSR &&
						import.meta.env.MODE === 'production' &&
						'serviceWorker' in navigator &&
						!inIframe() && <ServiceWorker />}
					<OverlayProvider>
						<ReduxProvider store={store}>
							<ThemeColorsProvider>
								<DisableAnimationOnPrintProvider>
									<SiteNameContext.Provider value={basename}>
										<I18nextProvider i18n={i18next}>
											<BrowserRouterProvider basename={basename}>
												{children}
											</BrowserRouterProvider>
										</I18nextProvider>
									</SiteNameContext.Provider>
								</DisableAnimationOnPrintProvider>
							</ThemeColorsProvider>
						</ReduxProvider>
					</OverlayProvider>
				</ErrorBoundary>
			</DesignSystemThemeProvider>
		</DarkModeProvider>
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
				>
					{children}
				</BrowserRouter>
			</TrackingContext.Provider>
		</HelmetProvider>
	)
}
