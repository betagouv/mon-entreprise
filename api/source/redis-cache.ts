import { createHash } from 'crypto'

import Router from '@koa/router'
import IORedis from 'ioredis'
import IORedisMock from 'ioredis-mock'
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

	router.post('/evaluate', koaBody(), async (ctx, next) => {
		if (!redis || !ctx.request.body) {
			await next()

			return
		}

		const cacheKey = createHash('sha1')
			.update(JSON.stringify(ctx.request.body))
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
	})

	return router.routes()
}
