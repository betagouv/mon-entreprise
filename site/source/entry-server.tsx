import { SSRProvider } from '@react-aria/ssr'
import ReactDOMServer from 'react-dom/server'
import { FilledContext, HelmetProvider } from 'react-helmet-async'
import { StaticRouter } from 'react-router-dom/server'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'
import { AppEn } from './entry-en'
import { AppFr } from './entry-fr'
import i18next from './locales/i18n'

export function render(url: string, lang: 'fr' | 'en') {
	const sheet = new ServerStyleSheet()
	const helmetContext = {} as FilledContext
	const App = lang === 'fr' ? AppFr : AppEn
	i18next.changeLanguage(lang).catch((err) =>
		// eslint-disable-next-line no-console
		console.error(err)
	)

	const element = (
		<HelmetProvider context={helmetContext}>
			<SSRProvider>
				<StyleSheetManager sheet={sheet.instance}>
					<StaticRouter location={url}>
						<App />
					</StaticRouter>
				</StyleSheetManager>
			</SSRProvider>
		</HelmetProvider>
	)

	// Render to initialize redux store (via useSimulationConfig)
	ReactDOMServer.renderToString(element)

	// Render with redux store configured
	const html = ReactDOMServer.renderToString(element)

	const styleTags = sheet.getStyleTags()

	return { html, styleTags, helmet: helmetContext.helmet }
}
