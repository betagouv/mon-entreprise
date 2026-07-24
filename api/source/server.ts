import cors from '@koa/cors'
import Router, { RouterContext } from '@koa/router'
import { koaMiddleware as publicodesAPI } from '@publicodes/rest-api'
import Koa from 'koa'
import rules from 'modele-social'
import Engine from 'publicodes'

import { analyticsMiddleware } from './analytics.js'
import { catchErrors } from './errors.js'
import { modèles } from './modeles.js'
import { rateLimiterMiddleware } from './rate-limiter.js'
import { redisCacheMiddleware } from './redis-cache.js'
import { docRoutes } from './route/doc.js'
import { openApiRoutes } from './route/openapi.js'
import Sentry, { requestHandler, tracingMiddleWare } from './sentry.js'
import v1unitéAdapterMiddleware from './v1unitéAdapterMiddleware.js'

type State = Koa.DefaultState
type Context = Koa.DefaultContext

export const app = new Koa<State, Context>()
const router = new Router<State, Context>({
	prefix: '/api/v1',
})

if (process.env.NODE_ENV === 'production') {
	app.proxy = true // Trust X-Forwarded-For proxy header

	app.use(requestHandler)
	app.use(tracingMiddleWare)

	app.on('error', (err, ctx: RouterContext) => {
		Sentry.withScope((scope) => {
			scope.addEventProcessor((event) =>
				Sentry.addRequestDataToEvent(event, ctx.request)
			)
			Sentry.captureException(err)
		})
	})
}

app.use(catchErrors())

app.use(cors())

router.use('', docRoutes(), openApiRoutes())

const engineOptions = {
	warn: {
		deprecatedSyntax: false,
		cyclicReferences: false,
	},
}

const apiRoutes = publicodesAPI(new Engine(rules, engineOptions))
router.use(
	'',
	rateLimiterMiddleware,
	redisCacheMiddleware(),
	analyticsMiddleware,
	v1unitéAdapterMiddleware(),
	apiRoutes
)

Object.entries(modèles).forEach(([nom, règles]) => {
	router.use(
		`/modeles/${nom}`,
		publicodesAPI(new Engine(règles, engineOptions))
	)
})

app.use(router.routes())
app.use(router.allowedMethods())
app.use((ctx) => {
	ctx.redirect('/api/v1/doc/')
})
