import got, { RequestError } from 'got'
import { BaseContext } from 'koa'

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

	console.log({ userAgent, xForwardedFor, referer, url })

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

export const plausibleMiddleware = async (
	ctx: BaseContext,
	next: () => Promise<unknown>
) => {
	if (process.env.NODE_ENV !== 'production') {
		return await next()
	}

	void plausibleEvent(ctx, { eventName: 'pageview' }).catch((err) => {
		const error = err as RequestError
		// eslint-disable-next-line no-console
		console.error(error.code, error.message)
	})

	const result = await next()

	void plausibleEvent(ctx, {
		eventName: 'status',
		props: {
			status: ctx.status,
		},
	}).catch((err) => {
		const error = err as RequestError
		// eslint-disable-next-line no-console
		console.error(error.code, error.message)
	})

	return result
}
