import cors from '@koa/cors'
import Router from '@koa/router'
import { koaMiddleware as publicodesAPI } from '@publicodes/api'
import Koa from 'koa'
import rules from 'modele-social'
import Engine from 'publicodes'
import openapi from './openapi.json' assert { type: 'json' }
import { docRoutes } from './route/doc.js'
import { openapiRoutes } from './route/openapi.js'

type State = Koa.DefaultState
type Context = Koa.DefaultContext

const app = new Koa<State, Context>()
const router = new Router<State, Context>()

app.use(cors())

const apiRoutes = publicodesAPI(() => new Engine(rules))

router.use('/api/v1', apiRoutes, docRoutes(), openapiRoutes(openapi))

app.use(router.routes())
app.use(router.allowedMethods())
app.use((ctx) => {
	ctx.redirect('/api/v1/doc/')
})

const port = process.env.PORT || 3004

app.listen(port, function () {
	// eslint-disable-next-line no-console
	console.log('listening on port:', port)
})
