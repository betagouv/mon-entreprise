import got, { RequestError } from 'got'
import { BaseContext, Next } from 'koa'

interface PlausibleEvent {
	eventName: string
	props?: Record<string, string | number | boolean>
}

export const plausibleEvent = (
	ctx: BaseContext,
	{ eventName, props }: PlausibleEvent
) => {
	const userAgent = ctx.headers['user-agent'] ?? ''
	const xForwardedFor =
		(Array.isArray(ctx.headers['x-forwarded-for'])
			? ctx.headers['x-forwarded-for'][0]
			: ctx.headers['x-forwarded-for']) ?? ''
	const referer = ctx.headers.referer ?? ''
	const url = ctx.href

	return got('https://plausible.io/api/event', {
		method: 'POST',
		headers: {
			'user-agent': userAgent,
			'x-forwarded-for': xForwardedFor,
		},
		json: {
			domain: 'mon-entreprise.urssaf.fr/api',
			name: eventName,
			referer,
			url,
			props,
		},
	})
}

export const plausibleMiddleware = async (ctx: BaseContext, next: Next) => {
	const xxx = Date.now().toString()
	console.time('requestA-' + xxx)
	void plausibleEvent(ctx, { eventName: 'pageview' })
		.catch((err) => {
			const error = err as RequestError
			console.error(error.code, error.message)
		})
		.then(() => {
			console.timeEnd('requestA-' + xxx)
		})
	console.timeLog('requestA-' + xxx)

	const result = (await next()) as unknown

	console.time('requestB-' + xxx)
	void plausibleEvent(ctx, {
		eventName: 'status',
		props: {
			status: ctx.status,
		},
	})
		.catch((err) => {
			const error = err as RequestError
			console.error(error.code, error.message)
		})
		.then(() => {
			console.timeEnd('requestB-' + xxx)
		})
	console.timeLog('requestB-' + xxx)

	return result
}
