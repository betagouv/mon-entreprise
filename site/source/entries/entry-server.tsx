import { ResizeObserver } from '@juggle/resize-observer'
import { SSRProvider } from '@react-aria/ssr'
import ReactDomServerType from 'react-dom/server'
// @ts-ignore
import ReactDomServer from 'react-dom/server.browser'
import { FilledContext, HelmetProvider } from 'react-helmet-async'
import { StaticRouter } from 'react-router-dom/server'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'

import { ReactRouterNavigationProvider } from '@/lib/navigation'

import i18next from '../locales/i18n'
import { AppEn } from './entry-en'
import { AppFr } from './entry-fr'

const { renderToReadableStream } = ReactDomServer as typeof ReactDomServerType

function streamToString(stream: ReadableStream<Uint8Array>) {
	return new Response(stream).text()
}

// @ts-ignore
global.window = {
	// @ts-ignore
	location: {},
	ResizeObserver,
}

interface Result {
	html: string
	styleTags: string
	helmet: FilledContext['helmet']
}

export async function render(url: string, lang: 'fr' | 'en'): Promise<Result> {
	global.window.location.href = url
	global.window.location.search = ''

	const sheet = new ServerStyleSheet()
	const helmetContext = {} as FilledContext
	i18next.changeLanguage(lang).catch((err) =>
		// eslint-disable-next-line no-console
		console.error('Error', err)
	)

	const element = (
		<HelmetProvider context={helmetContext}>
			<SSRProvider>
				<StyleSheetManager sheet={sheet.instance}>
					<StaticRouter location={url}>
						<ReactRouterNavigationProvider>
							{lang === 'fr' ? <AppFr /> : <AppEn />}
						</ReactRouterNavigationProvider>
					</StaticRouter>
				</StyleSheetManager>
			</SSRProvider>
		</HelmetProvider>
	)

	try {
		const stream = await renderToReadableStream(element, {
			onError(error, errorInfo) {
				// eslint-disable-next-line no-console
				console.error({ error, errorInfo })
			},
		})

		await stream.allReady

		const html = await streamToString(stream)

		const styleTags = sheet.getStyleTags()

		return { html, styleTags, helmet: helmetContext.helmet }
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error(error)

		throw error
	}
}
