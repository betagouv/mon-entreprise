import Router from '@koa/router'
import { openapi as publicodesOpenapi } from '@publicodes/rest-api'
import { Context } from 'koa'

import { analyticsMiddleware } from '../analytics.js'
import { mergeDeep } from '../utils.js'

/**
 * /openapi.json route, merge customOpenapi with @publicodes/rest-api openapi json
 * @param customOpenapi
 * @returns
 */
export const openapiRoutes = (customOpenapi: Record<string, unknown>) => {
	const router = new Router()

	const mergedOpenapi = mergeDeep(publicodesOpenapi, customOpenapi)

	router.get('/openapi.json', analyticsMiddleware, (ctx: Context) => {
		ctx.type = 'application/json'
		ctx.body = mergedOpenapi
	})

	return router.routes()
}
