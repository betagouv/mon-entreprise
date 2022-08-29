import { BaseContext, Next } from 'koa'
import { RateLimiterMemory, RateLimiterRedis } from 'rate-limiter-flexible'
import IORedis from 'ioredis'

const Redis = IORedis.default

const rateLimiter =
	process.env.NODE_ENV === 'production' && process.env.SCALINGO_REDIS_URL
		? new RateLimiterRedis({
				storeClient: new Redis(process.env.SCALINGO_REDIS_URL, {
					enableOfflineQueue: false,
				}),
				keyPrefix: 'middleware',
				points: 5, // 5 requests for ctx.ip
				duration: 1, // per 1 second
		  })
		: new RateLimiterMemory({
				points: 5, // 5 requests for ctx.ip
				duration: 1, // per 1 seconds
		  })

export const rateLimiterMiddleware = async (ctx: BaseContext, next: Next) => {
	try {
		await rateLimiter.consume(ctx.ip)
	} catch (rejRes) {
		ctx.status = 429
		ctx.body = 'Too Many Requests'

		return
	}

	await next()
}
