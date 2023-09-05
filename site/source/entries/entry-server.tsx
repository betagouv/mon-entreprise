import { SSRProvider } from '@react-aria/ssr'
import { lazy } from 'react'
import ReactDomServer, { type renderToReadableStream } from 'react-dom/server'
import { FilledContext, HelmetProvider } from 'react-helmet-async'
import { StaticRouter } from 'react-router-dom/server'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'

import i18next from '../locales/i18n'

function streamToString(stream: ReadableStream<Uint8Array>) {
	return new Response(stream).text()
}

const AppFrLazy = lazy(async () => ({
	default: (await import('./entry-fr')).AppFr,
}))

const AppEnLazy = lazy(async () => ({
	default: (await import('./entry-en')).AppEn,
}))

// @ts-ignore
global.window = {
	// @ts-ignore
	location: {},
}

interface Result {
	html: string
	styleTags: string
	helmet: FilledContext['helmet']
}

export async function render(url: string, lang: 'fr' | 'en'): Promise<Result> {
	global.window.location.href = url
	global.window.location.search = ''
	console.log({ url, lang })

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
						[prerender] window: {JSON.stringify(window)}
						{lang === 'fr' ? <AppFrLazy /> : <AppEnLazy />}
					</StaticRouter>
				</StyleSheetManager>
			</SSRProvider>
		</HelmetProvider>
	)

	console.log('!!! STARTING !!!')

	try {
		const stream = await (
			ReactDomServer.renderToReadableStream as unknown as typeof renderToReadableStream
		)(element, {
			onError(error, errorInfo) {
				console.error({ error, errorInfo })
			},
		})

		console.log('!!! LOADING !!!')

		await stream.allReady

		console.log('!!! DONE !!!')

		const html = await streamToString(stream)

		const styleTags = sheet.getStyleTags()

		return { html, styleTags, helmet: helmetContext.helmet }
	} catch (error) {
		console.error(error)

		throw error
	}
}
