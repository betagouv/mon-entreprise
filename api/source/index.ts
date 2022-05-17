import cors from '@koa/cors'
import Router from '@koa/router'
import Koa from 'koa'
import rules from 'modele-social'
import Engine from 'publicodes'
import { koaMiddleware as publicodesAPI } from 'publicodes-api'
// @ts-ignore
import openapi from './openapi.json'
import { docRoutes } from './route/doc.js'
import { openapiRoutes } from './route/openapi.js'

type State = Koa.DefaultState

type Context = Koa.DefaultContext

const app = new Koa<State, Context>()
const router = new Router<State, Context>()

app.use(cors())

const apiRoutes = publicodesAPI(() => new Engine(rules))

router.use('/v1', apiRoutes, docRoutes(), await openapiRoutes(openapi))

app.use(router.routes())
app.use(router.allowedMethods())

const port = 3004

app.listen(port, function () {
	// eslint-disable-next-line no-console
	console.log('listening on port:', port)
})
