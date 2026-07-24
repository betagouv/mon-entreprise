import { createHash } from 'crypto'

import Router from '@koa/router'
import IORedis from 'ioredis'
import IORedisMock from 'ioredis-mock'
import { DefaultContext, DefaultState, Next, ParameterizedContext } from 'koa'
import { koaBody } from 'koa-body'

import { superviserRedis } from './redis-supervision.js'

const Redis = IORedis.default
const RedisMock = IORedisMock.default

// cache expires in 24 hours (in seconds)
const CACHE_EXPIRE = 24 * 60 * 60

const redis =
	process.env.NODE_ENV === 'production' && process.env.SCALINGO_REDIS_URL
		? new Redis(process.env.SCALINGO_REDIS_URL, {
				enableOfflineQueue: false,
				keyPrefix: 'cache',
		  })
		: new RedisMock()

superviserRedis(redis, 'cache')

export const redisCacheMiddleware = () => {
	const router = new Router()

	const evaluatePaths = {
		'/evaluate': 'modele-social',
		'/modeles/as/evaluate': 'modele-as',
		'/modeles/ti/evaluate': 'modele-ti',
	}

	Object.keys(evaluatePaths).forEach((path) => {
		router.post(path, koaBody(), async (ctx, next) => {
			await handleCache(
				ctx,
				next,
				evaluatePaths[path as keyof typeof evaluatePaths]
			)
		})
	})

	return router.routes()
}

// L'import direct du type Context de koa provoque une erreur de type ligne 91
// sur `...ctx.body`
type Context = ParameterizedContext<
	DefaultState,
	DefaultContext & Router.RouterParamContext<DefaultState, DefaultContext>,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	any
>

const handleCache = async (ctx: Context, next: Next, modèle: string) => {
	if (!redis || !ctx.request.body) {
		await next()

		return
	}

	const cacheKey = createHash('sha1')
		.update(
			JSON.stringify({
				modèle,
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				requête: ctx.request.body,
			})
		)
		.digest('base64')

	// Si Redis ne répond pas, on répond sans cache.
	const cachedResponse = await redis.get(cacheKey).catch(() => null)
	if (cachedResponse) {
		ctx.body = JSON.parse(cachedResponse) as unknown

		return
	}

	await next()

	if (ctx.status === 200) {
		const responseCachedAt = Date.now()
		const cacheExpiresAt = responseCachedAt + CACHE_EXPIRE * 1000
		// Si Redis ne répond pas, on n'enregistre pas.
		await redis
			.set(
				cacheKey,
				JSON.stringify({ responseCachedAt, cacheExpiresAt, ...ctx.body }),
				'EX',
				CACHE_EXPIRE
			)
			.catch(() => undefined)
	}
}
