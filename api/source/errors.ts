import { Middleware } from 'koa'

type JsonError = { status: number; body: string; message: string }

const isJsonError = (err: unknown): err is JsonError =>
	!!err &&
	typeof err === 'object' &&
	'message' in err &&
	'status' in err &&
	'body' in err &&
	(err as { status: unknown }).status === 400 &&
	typeof (err as { body: unknown }).body === 'string' &&
	typeof (err as { message: unknown }).message === 'string'

export const catchErrors = (): Middleware => async (ctx, next) => {
	try {
		await next()
	} catch (error) {
		if (isJsonError(error)) {
			ctx.status = error.status
			ctx.body = error.message
		} else {
			throw error
		}
	}
}
