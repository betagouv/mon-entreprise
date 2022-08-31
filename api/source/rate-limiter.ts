import IORedis from 'ioredis'
import { BaseContext, Next } from 'koa'
import {
	RateLimiterMemory,
	RateLimiterRedis,
	RateLimiterRes,
} from 'rate-limiter-flexible'

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

		if (isRateLimiterRes(rejRes)) {
			ctx.set({
				'Retry-After': (rejRes.msBeforeNext / 1000).toString(),
				'X-RateLimit-Limit': rateLimiter.points.toString(),
				'X-RateLimit-Remaining': rejRes.remainingPoints.toString(),
				'X-RateLimit-Reset': new Date(
					Date.now() + rejRes.msBeforeNext
				).toString(),
			})
		}

		return
	}

	await next()
}

const isRateLimiterRes = (val: unknown): val is RateLimiterRes => {
	return !!(
		val &&
		typeof val === 'object' &&
		[
			'msBeforeNext',
			'remainingPoints',
			'consumedPoints',
			'isFirstInDuration',
		].every((s) => s in val)
	)
}
