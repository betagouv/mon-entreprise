import IORedis from 'ioredis'
import { BaseContext } from 'koa'
import {
	RateLimiterMemory,
	RateLimiterRedis,
	RateLimiterRes,
} from 'rate-limiter-flexible'

import { superviserRedis } from './redis-supervision.js'

const Redis = IORedis.default

const créerRateLimiter = () => {
	const { NODE_ENV, SCALINGO_REDIS_URL } = process.env

	if (NODE_ENV !== 'production' || !SCALINGO_REDIS_URL) {
		return new RateLimiterMemory({ points: 5, duration: 1 })
	}

	const storeClient = new Redis(SCALINGO_REDIS_URL, {
		enableOfflineQueue: false,
		keyPrefix: 'rate-limiter',
	})
	superviserRedis(storeClient, 'rate-limiter')

	return new RateLimiterRedis({
		storeClient,
		keyPrefix: 'rate-limiter',
		points: 5, // 5 requests for ctx.ip
		duration: 1, // per 1 second
		// Compteur de secours en mémoire : si Redis est indisponible, le
		// rate-limiting continue (par conteneur) plutôt que d'échouer.
		insuranceLimiter: new RateLimiterMemory({ points: 5, duration: 1 }),
	})
}

const rateLimiter = créerRateLimiter()

export const rateLimiterMiddleware = async (
	ctx: BaseContext,
	next: () => Promise<unknown>
) => {
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

	return await next()
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
