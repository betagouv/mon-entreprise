import { BaseContext } from 'koa'
// @ts-ignore
import { pianoAnalytics } from 'piano-analytics-js'

pianoAnalytics.setConfigurations({
	site: 617190,
	collectDomain: 'https://tm.urssaf.fr',
})

const estRouteDeModèle = (page?: string) =>
	page === 'evaluate' || page === 'rules'

const extractPathElements = (path: string) => {
	const segments = path.split('/').filter(Boolean)

	if (path.includes('/modeles/')) {
		const [api, apiVersion, , modèle, page] = segments

		return { api, apiVersion, page, modèle: `modele-${modèle}` }
	}

	const [api, apiVersion, page] = segments

	return {
		api,
		apiVersion,
		page,
		modèle: estRouteDeModèle(page) ? 'modele-social' : undefined,
	}
}

export function pathToPageData(path: string) {
	const { modèle, page, api, apiVersion } = extractPathElements(path)

	return {
		page,
		page_chapter1: api,
		page_chapter2: apiVersion,
		...(modèle ? { page_chapter3: modèle } : {}),
	}
}

export const analyticsMiddleware = async (
	ctx: BaseContext,
	next: () => Promise<unknown>
) => {
	if (process.env.NODE_ENV !== 'production') {
		return next()
	}
	const pageData = pathToPageData(ctx.path)
	pianoAnalytics.sendEvent(
		'page.display', // Event name
		pageData // Event properties
	)
	const result = await next()
	pianoAnalytics.sendEvent(
		'click.exit', // Event used for tracking status code
		{
			click: ctx.status,
			...pageData, // Event properties
		}
	)

	return result
}
