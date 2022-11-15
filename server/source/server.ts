import cors from '@koa/cors'
import Router from '@koa/router'
import dotenv from 'dotenv'
import Koa from 'koa'
import koaBody from 'koa-body'

import {
	PORT,
	clientId,
	clientSecret,
	redirectUri,
	serverUrl,
} from './config.js'
import { BodyType, sendCrispMessage } from './functions/send-crisp-message.js'
import { bree } from './jobs.js'
import { initMongodb } from './mongodb.js'
import { getAccessToken } from './oauth.js'
import { snakeToCamelCaseKeys, validateCrispBody } from './utils.js'

dotenv.config()

const mongo = await initMongodb()

type KoaState = Koa.DefaultState
type KoaContext = Koa.DefaultContext

const app = new Koa<KoaState, KoaContext>()
const router = new Router<KoaState, KoaContext>()

app.use(cors())

router.get('/connect', (ctx) => {
	const { state = '' } = ctx.query
	const url =
		`${serverUrl}/oauth/authorize?` +
		[
			`client_id=${clientId}`,
			`redirect_uri=${redirectUri}`,
			`response_type=code`,
			`state=${state?.toString()}`,
		].join('&')

	ctx.redirect(url)
})

router.get('/oauth', async (ctx) => {
	const { code, error, state } = ctx.query

	if (error) {
		ctx.status = 400
		ctx.body = error

		return
	}
	if (typeof code !== 'string') {
		ctx.status = 400
		ctx.body = 'Bad code'

		return
	}

	try {
		const { body } = await getAccessToken({
			serverUrl,
			clientSecret,
			clientId,
			redirectUri,
			code,
		})

		await mongo.saveOAuth(snakeToCamelCaseKeys(body))

		if (
			typeof state === 'string' &&
			['run-all', ...bree.config.jobs.map(({ name }) => name)].includes(state)
		) {
			await (state === 'run-all' ? bree.run() : bree.run(state))
		}

		ctx.status = 200
	} catch (err) {
		// eslint-disable-next-line no-console
		console.error(err)

		ctx.status = 400
	}
})

router.post('/send-crisp-message', koaBody(), async (ctx) => {
	try {
		const body = validateCrispBody(ctx.request.body as BodyType)

		await sendCrispMessage(body)

		ctx.status = 200
	} catch (err) {
		// eslint-disable-next-line no-console
		console.error(err)

		ctx.status = 400
	}
})

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(PORT, () => {
	// eslint-disable-next-line no-console
	console.log(`app listening on port ${PORT}`)
})
