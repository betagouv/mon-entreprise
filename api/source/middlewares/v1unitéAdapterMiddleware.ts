import Router from '@koa/router'
import { Context, Next } from 'koa'

import { modèles } from '../modeles.js'

export default function v1unitéAdapterMiddleware() {
	const router = new Router()

	const evaluatePaths = [
		'/evaluate',
		...Object.keys(modèles).map((nom) => `/modeles/${nom}/evaluate`),
	]

	router.post(evaluatePaths, async (ctx, next) => {
		await handleUnitéAdapter(ctx, next)
	})

	return router.routes()
}

const handleUnitéAdapter = async (ctx: Context, next: Next) => {
	if (!ctx.request.body) {
		return next()
	}

	ctx.request.body = deepMap(ctx.request.body, (value, key) => {
		if (key === 'unité' && typeof value === 'string') {
			const newValue = value.replace(' /', '/').replace('/ ', '/')

			return newValue
		}

		return value
	})

	return next()
}

function deepMap(
	jsonLike: unknown,
	fn: (x: unknown, key?: string) => unknown
): unknown {
	if (Array.isArray(jsonLike)) {
		return jsonLike.map((x) => deepMap(x, fn))
	}
	if (jsonLike && typeof jsonLike === 'object') {
		return Object.fromEntries(
			Object.entries(jsonLike).map(([key, value]) => {
				if (typeof value === 'object' && value !== null) {
					return [key, deepMap(value, fn)]
				}

				return [key, fn(value, key)]
			})
		)
	}

	return fn(jsonLike)
}
