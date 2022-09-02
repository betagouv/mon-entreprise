import { ThemeColorsProvider } from '@/components/utils/colors'
import { DisableAnimationOnPrintProvider } from '@/components/utils/DisableAnimationContext'
import { IsEmbeddedProvider } from '@/components/utils/embeddedContext'
import { GlobalStyle } from '@/design-system/global-style'
import { Container } from '@/design-system/layout'
import DesignSystemThemeProvider from '@/design-system/root'
import { H1 } from '@/design-system/typography/heading'
import { Link } from '@/design-system/typography/link'
import { Body, Intro } from '@/design-system/typography/paragraphs'
import { useIframeResizer } from '@/hooks/useIframeResizer'
import logo from '@/images/logo-monentreprise.svg'
import { OverlayProvider } from '@react-aria/overlays'
import { ErrorBoundary } from '@sentry/react'
import i18next from 'i18next'
import { createContext, ReactNode, useLayoutEffect, useState } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { I18nextProvider } from 'react-i18next'
import { Provider as ReduxProvider } from 'react-redux'
import { Router } from 'react-router-dom'
import { ServiceWorker } from './ServiceWorker'
import * as safeLocalStorage from './storage/safeLocalStorage'
import { store } from './store'
import { inIframe } from './utils'

// ATInternet Tracking
import { TrackingContext } from './ATInternetTracking'
import { createTracker } from './ATInternetTracking/Tracker'
import { createBrowserHistory } from 'history'
import { useSaveScrollPosition } from './hooks/useSaveScrollPosition'

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

	return (
		<DesignSystemThemeProvider>
			<GlobalStyle />
			<ErrorBoundary
				showDialog
				fallback={
					<Container>
						<Link href="/">
							<img
								src={logo}
								alt="logo service mon-entreprise urssaf"
								style={{
									maxWidth: '200px',
									width: '100%',
									marginTop: '1rem',
								}}
							></img>
						</Link>
						<H1>Une erreur est survenue</H1>
						<Intro>
							L'équipe technique mon-entreprise a été automatiquement prévenue.
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
						<IsEmbeddedProvider>
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
						</IsEmbeddedProvider>
					</ReduxProvider>
				</OverlayProvider>
			</ErrorBoundary>
		</DesignSystemThemeProvider>
	)
}

const history = createBrowserHistory()

export const CustomRouter = ({ ...props }) => {
	const [state, setState] = useState({
		action: history.action,
		location: history.location,
		scrollY: 0,
	})

	useLayoutEffect(
		() =>
			history.listen((stateValue) => {
				setState({ ...stateValue, scrollY: window.scrollY })
			}),
		[]
	)

	useSaveScrollPosition(state)

	return (
		<Router
			{...props}
			location={state.location}
			navigationType={state.action}
			navigator={history}
		/>
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
				<CustomRouter
					basename={import.meta.env.MODE === 'production' ? '' : basename}
				>
					{children}
				</CustomRouter>
			</TrackingContext.Provider>
		</HelmetProvider>
	)
}
