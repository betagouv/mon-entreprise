import cors from '@koa/cors'
import Router, { RouterContext } from '@koa/router'
import { koaMiddleware as publicodesAPI } from '@publicodes/api'
import Koa from 'koa'
import rules from 'modele-social'
import Engine from 'publicodes'
import { catchErrors } from './errors.js'
import openapi from './openapi.json' assert { type: 'json' }
import { plausibleMiddleware } from './plausible.js'
import { rateLimiterMiddleware } from './rate-limiter.js'
import { docRoutes } from './route/doc.js'
import { openapiRoutes } from './route/openapi.js'
import Sentry, { requestHandler, tracingMiddleWare } from './sentry.js'

type State = Koa.DefaultState
type Context = Koa.DefaultContext

const app = new Koa<State, Context>()
const router = new Router<State, Context>()

if (process.env.NODE_ENV === 'production') {
	app.proxy = true // Trust X-Forwarded-For proxy header

	app.use(requestHandler)
	app.use(tracingMiddleWare)

	app.on('error', (err, ctx: RouterContext) => {
		Sentry.withScope((scope) => {
			scope.addEventProcessor((event) => {
				return Sentry.Handlers.parseRequest(event, ctx.request)
			})
			Sentry.captureException(err)
		})
	})
}

app.use(catchErrors())

app.use(cors())

router.use('/api/v1', docRoutes(), openapiRoutes(openapi))

const apiRoutes = publicodesAPI(new Engine(rules))

router.use('/api/v1', plausibleMiddleware, rateLimiterMiddleware, apiRoutes)

app.use(router.routes())
app.use(router.allowedMethods())
app.use((ctx) => {
	ctx.redirect('/api/v1/doc/')
})

const port = process.env.PORT || 3004

const server = app.listen(port, function () {
	// eslint-disable-next-line no-console
	console.log('listening on port:', port)
})

export { server, app }
