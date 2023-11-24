import Router from '@koa/router'
import koaStatic from 'koa-static'
import { absolutePath } from 'swagger-ui-dist'

import { analyticsMiddleware } from '../analytics.js'

export const docRoutes = () => {
	const router = new Router()

	router.all(
		'/doc/(.*)',
		analyticsMiddleware,
		async (ctx, next) => {
			const rewriteURL =
				(typeof ctx.url === 'string' && ctx.url.replace(/.*\/doc\//, '/')) ||
				null

			const backup = ctx.request.url
			if (rewriteURL) {
				ctx.request.url = rewriteURL
			}

			const ret = (await next()) as unknown

			if (rewriteURL) {
				ctx.request.url = backup
			}

			return ret
		},
		koaStatic('./public/doc'),
		koaStatic(absolutePath())
	)

	return router.routes()
}
