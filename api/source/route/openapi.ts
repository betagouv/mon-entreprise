import Router from '@koa/router'
import { Context } from 'koa'

import { analyticsMiddleware } from '../middlewares/analytics.js'
import openapi from '../openapi.json' with { type: 'json' }

export const openApiRoutes = () => {
	const router = new Router()

	router.get('/openapi.json', analyticsMiddleware, (ctx: Context) => {
		ctx.type = 'application/json'
		ctx.body = openapi
	})

	return router.routes()
}
