import { createHash } from 'crypto'

import Router from '@koa/router'
import IORedis from 'ioredis'
import IORedisMock from 'ioredis-mock'
import { koaBody } from 'koa-body'

const Redis = IORedis.default
const RedisMock = IORedisMock.default

// cache expires in 12 hours
const CACHE_EXPIRE = 12 * 60 * 60

const redis =
	process.env.NODE_ENV === 'production' && process.env.SCALINGO_REDIS_URL
		? new Redis(process.env.SCALINGO_REDIS_URL, {
				enableOfflineQueue: false,
				keyPrefix: 'cache',
		  })
		: new RedisMock()

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

		const cachedResponse = await redis.get(cacheKey)
		if (cachedResponse) {
			ctx.body = JSON.parse(cachedResponse) as unknown

			return
		}

		await next()

		if (ctx.status === 200) {
			await redis.set(
				cacheKey,
				JSON.stringify({ responseCachedAt: Date.now(), ...ctx.body }),
				'EX',
				CACHE_EXPIRE
			)
		}
	})

	return router.routes()
}
