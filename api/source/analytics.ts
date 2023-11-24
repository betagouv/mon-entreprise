import { BaseContext } from 'koa'
// @ts-ignore
import { pianoAnalytics } from 'piano-analytics-js'

pianoAnalytics.setConfigurations({
	site: 617190,
	collectDomain: 'https://tm.urssaf.fr',
})

function pathToPageData(path: string) {
	const [pageChapter1, pageChapter2, page] = path.split('/').filter(Boolean)

	return {
		page,
		page_chapter1: pageChapter1,
		page_chapter2: pageChapter2,
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
