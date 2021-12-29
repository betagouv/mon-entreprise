import ReactDOMServer from 'react-dom/server'
import { SSRProvider } from '@react-aria/ssr'
import { StaticRouter } from 'react-router-dom'
import i18next from './locales/i18n'
import { AppFr } from './entry.fr'
import { AppEn } from './entry.en'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'
import { FilledContext, HelmetProvider } from 'react-helmet-async'

export function render(url: string, lang: 'fr' | 'en') {
	const sheet = new ServerStyleSheet()
	const helmetContext = {} as FilledContext
	const App = lang === 'fr' ? AppFr : AppEn
	i18next.changeLanguage(lang)

	const html = ReactDOMServer.renderToString(
		<SSRProvider>
			<HelmetProvider context={helmetContext}>
				<StyleSheetManager sheet={sheet.instance}>
					<StaticRouter location={url}>
						<App />
					</StaticRouter>
				</StyleSheetManager>
			</HelmetProvider>
		</SSRProvider>
	)

	const styleTags = sheet.getStyleTags()

	return { html, styleTags, helmet: helmetContext.helmet }
}
