import Router from '@koa/router'
import { openapi as publicodesOpenapi } from '@publicodes/api'
import { Context } from 'koa'

import { plausibleMiddleware } from '../plausible.js'
import { mergeDeep } from '../utils.js'

/**
 * /openapi.json route, merge customOpenapi with @publicodes/api openapi json
 * @param customOpenapi
 * @returns
 */
export const openapiRoutes = (customOpenapi: Record<string, unknown>) => {
	const router = new Router()

	const mergedOpenapi = mergeDeep(publicodesOpenapi, customOpenapi)

	router.get('/openapi.json', plausibleMiddleware, (ctx: Context) => {
		ctx.type = 'application/json'
		ctx.body = mergedOpenapi
	})

	return router.routes()
}
