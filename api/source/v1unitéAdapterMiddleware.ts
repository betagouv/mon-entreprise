import { BaseContext } from 'koa'

export default async function v1unitéAdapterMiddleware(
	ctx: BaseContext,
	next: () => Promise<unknown>
) {
	if (!ctx.path.startsWith('/api/v1/evaluate')) {
		return await next()
	}

	if (!ctx.body) {
		return await next()
	}
	const body = ctx.body as Record<string, unknown>
	ctx.body = deepMap(body, (value, key) => {
		if (key === 'unité' && typeof value === 'string') {
			return value.replace(' /', '/').replace(' /', '/')
		}

		return value
	})

	await next()
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
