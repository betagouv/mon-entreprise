import cors from '@koa/cors'
import Router from '@koa/router'
import { koaMiddleware as publicodesAPI } from '@publicodes/api'
import { readFileSync } from 'fs'
import Koa from 'koa'
import rules from 'modele-social'
import path from 'path'
import Engine from 'publicodes'
import { docRoutes } from './route/doc.js'
import { openapiRoutes } from './route/openapi.js'

type State = Koa.DefaultState

type Context = Koa.DefaultContext

const app = new Koa<State, Context>()
const router = new Router<State, Context>()

app.use(cors())

const apiRoutes = publicodesAPI(() => new Engine(rules))

const openapi = JSON.parse(
	// eslint-disable-next-line no-undef
	readFileSync(path.resolve(__dirname, 'openapi.json'), { encoding: 'utf8' })
) as Record<string, unknown>
router.use('/api/v1', apiRoutes, docRoutes(), openapiRoutes(openapi))

app.use(router.routes())
app.use(router.allowedMethods())

const port = 3004

app.listen(port, function () {
	// eslint-disable-next-line no-console
	console.log('listening on port:', port)
})

export { app }
