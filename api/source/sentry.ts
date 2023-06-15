// eslint-disable-next-line n/no-deprecated-api
import Domains from 'domain'

import { RouterContext } from '@koa/router'
import * as Sentry from '@sentry/node'
import * as Tracing from '@sentry/tracing'
import { Context, Next } from 'koa'

const release =
	(process.env.APP ?? '') +
	'-' +
	(process.env.CONTAINER_VERSION ?? '').substring(0, 7)

Sentry.init({
	dsn: 'https://21ddaba2424b46b4b14185dba51b1288@sentry.incubateur.net/42',

	// Set tracesSampleRate to 1.0 to capture 100%
	// of transactions for performance monitoring.
	// We recommend adjusting this value in production
	tracesSampleRate: 0.5,
	release,
	environment: release.includes('api-pr') ? 'test' : 'production',
})

export default Sentry

// not mandatory, but adding domains does help a lot with breadcrumbs
export const requestHandler = (ctx: Context, next: Next) => {
	return new Promise<void>((resolve) => {
		const local = Domains.create()
		local.add(ctx as never)
		local.on('error', (err) => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			ctx.status = (err.status as number) || 500
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			ctx.body = err.message
			ctx.app.emit('error', err, ctx)
		})
		void local.run(async () => {
			Sentry.getCurrentHub().configureScope((scope) =>
				scope.addEventProcessor((event) =>
					Sentry.Handlers.parseRequest(event, ctx.request, { user: false })
				)
			)
			await next()
			resolve()
		})
	})
}

// this tracing middleware creates a transaction per request
export const tracingMiddleWare = async (ctx: RouterContext, next: Next) => {
	const reqMethod = (ctx.method || '').toUpperCase()
	const reqUrl = ctx.url && Tracing.stripUrlQueryAndFragment(ctx.url)

	// connect to trace of upstream app
	let traceparentData
	if (ctx.request.get('sentry-trace')) {
		traceparentData = Tracing.extractTraceparentData(
			ctx.request.get('sentry-trace')
		)
	}

	const transaction = Sentry.startTransaction({
		name: `${reqMethod} ${reqUrl}`,
		op: 'http.server',
		...traceparentData,
	})

	ctx.__sentry_transaction = transaction

	// We put the transaction on the scope so users can attach children to it
	Sentry.getCurrentHub().configureScope((scope) => {
		scope.setSpan(transaction)
	})

	ctx.res.on('finish', () => {
		// Push `transaction.finish` to the next event loop so open spans have a chance to finish before the transaction closes
		setImmediate(() => {
			// if using koa router, a nicer way to capture transaction using the matched route
			if (ctx._matchedRoute) {
				const mountPath = (ctx.mountPath as undefined | string) || ''
				transaction.setName(
					`${reqMethod} ${mountPath}${ctx._matchedRoute.toString()}`
				)
			}
			transaction.setHttpStatus(ctx.status)
			transaction.finish()
		})
	})

	await next()
}
