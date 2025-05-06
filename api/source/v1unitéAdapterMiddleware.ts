import Router from '@koa/router'

export default function v1unitéAdapterMiddleware() {
	const router = new Router()

	router.post('/evaluate', async (ctx, next) => {
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
	})

	return router.routes()
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
