import { RouterContext } from '@koa/router'
import Sentry from '@sentry/node'
import { stripUrlQueryAndFragment } from '@sentry/utils'
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

	integrations: [
		// Automatically instrument Node.js libraries and frameworks
		...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
	],
})

export default Sentry

export const requestHandler = async (ctx: Context, next: Next) =>
	Sentry.runWithAsyncContext(() => {
		const hub = Sentry.getCurrentHub()
		hub.configureScope((scope) =>
			scope.addEventProcessor((event) =>
				Sentry.addRequestDataToEvent(event, ctx.request, {
					include: { user: false },
				})
			)
		)

		return next()
	})

// this tracing middleware creates a transaction per request
export const tracingMiddleWare = async (ctx: RouterContext, next: Next) => {
	const reqMethod = (ctx.method || '').toUpperCase()
	const reqUrl = ctx.url && stripUrlQueryAndFragment(ctx.url)

	// connect to trace of upstream app
	let traceparentData
	if (ctx.request.get('sentry-trace')) {
		traceparentData = Sentry.extractTraceparentData(
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
				transaction.setName(`${reqMethod} ${mountPath}${ctx._matchedRoute}`)
			}
			transaction.setHttpStatus(ctx.status)
			transaction.finish()
		})
	})

	await next()
}
