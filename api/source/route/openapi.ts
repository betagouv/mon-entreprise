import Router from '@koa/router'
import { Context } from 'koa'
import { openapi as publicodesOpenapi } from '@publicodes/api'
import { mergeDeep } from '../utils.js'

/**
 * /openapi.json route, merge customOpenapi with @publicodes/api openapi json
 * @param customOpenapi
 * @returns
 */
export const openapiRoutes = (customOpenapi?: Record<string, unknown>) => {
	const router = new Router()

	const mergedOpenapi = customOpenapi
		? mergeDeep(publicodesOpenapi, customOpenapi)
		: publicodesOpenapi

	router.get('/openapi.json', (ctx: Context) => {
		ctx.type = 'application/json'
		ctx.body = mergedOpenapi
	})

	return router.routes()
}
