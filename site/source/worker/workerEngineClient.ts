import type { WorkerEngineAction, WorkerEngineActions } from './workerEngine'

// if (typeof Worker === 'undefined') {
// 	throw new Error('Worker is not supported.')
// }

/**
 * This file is a client to communicate with workerEngine.
 */

const isObject = (val: unknown): val is object =>
	typeof val === 'object' && val !== null

const isId = (val: object): val is { id: number } =>
	'id' in val && typeof val.id === 'number'

const isBatch = (val: object): val is { batch: unknown[] } =>
	'batch' in val && Array.isArray(val.batch)

interface WorkerEnginePromise<
	Actions extends WorkerEngineActions = WorkerEngineActions,
	ActionNames extends Actions['action'] = Actions['action'],
	// InitParams extends unknown[] = unknown[],
	// Name extends string = string,
	// T extends Actions['action'] = Actions['action'],
> {
	engineId: number
	action: ActionNames
	resolve: (value: unknown) => void
	reject: (value: unknown) => void
}

interface Ctx<
	Actions extends WorkerEngineActions = WorkerEngineActions,
	// Promises extends WorkerEnginePromise = WorkerEnginePromise,
	// >
	// Actions extends WorkerEngineActions<InitParams, Name>,
	// InitParams extends unknown[] = unknown[],
	// Name extends string = string,
> {
	engineId: number
	promises: WorkerEnginePromise<Actions>[]
	lastCleanup: null | NodeJS.Timeout
	worker: Worker
	isWorkerReady: Promise<number>
}

export type WorkerEngineClient<Actions extends WorkerEngineActions> =
	ReturnType<typeof createWorkerEngineClient<Actions>>

export const createWorkerEngineClient = <Actions extends WorkerEngineActions>(
	worker: Worker,
	options: {
		initParams: WorkerEngineAction<Actions, 'init'>['params']
		onSituationChange?: (engineId: number) => void
	}
) => {
	console.log('{createWorker}')

	const ctx: Ctx<Actions> = {
		engineId: 0,
		promises: [],
		lastCleanup: null,
		worker,
		isWorkerReady: null as unknown as Promise<number>, // will be set later in the function
	}

	worker.onmessageerror = function (e) {
		console.log('{onmessageerror}', e)
	}

	worker.onerror = function (e) {
		console.log('{onerror}', e)
	}

	const ppp = (data: { id: number; result?: unknown; error?: string }) => {
		console.timeEnd(`execute-${data.id}`)
		if (data.id === 0) {
			console.timeEnd('loading')
		}

		if ('error' in data) {
			return ctx.promises[data.id].reject?.(data.error)
		}
		ctx.promises[data.id].resolve?.(data.result)
	}

	worker.onmessage = function (e: MessageEvent<unknown>) {
		const data = e.data

		console.log('{msg}', data)

		if (isObject(data)) {
			if (isId(data)) {
				ppp(data)

				return
			} else if (isBatch(data)) {
				data.batch.forEach((d) => isObject(d) && isId(d) && ppp(d))

				return
			}
		}

		console.error('{unknown message}', data)

		throw new Error('unknown message')
	}

	const { initParams, onSituationChange } = options

	ctx.isWorkerReady = postMessage(ctx, 'init', ...initParams)

	const workerEngine = workerEngineConstruct(ctx, { onSituationChange })

	return workerEngine
}

/**
 * Post message to worker engine and return a promise to get the result,
 * if the promise is not resolved in 10 seconds, it will be rejected.
 * @param ctx
 * @param action
 * @param params
 */
const postMessage = async <
	Actions extends WorkerEngineActions,
	ActionNames extends Actions['action'],
	Action extends WorkerEngineAction<Actions, ActionNames>,
>(
	ctx: Ctx,
	action: ActionNames,
	...params: Action['params']
) => {
	const { engineId, worker } = ctx

	console.log('{postMessage}', action, params)

	const promiseTimeout = 10000
	const warning = setTimeout(() => {
		console.log('{promise waiting for too long, aborting!}', action, params)
		ctx.promises[id].reject?.(new Error('timeout'))
	}, promiseTimeout)

	ctx.lastCleanup !== null && clearInterval(ctx.lastCleanup)
	ctx.lastCleanup = setTimeout(() => {
		if (ctx.promises.length) {
			console.log('{cleanup}', ctx.promises.length)
			ctx.promises = []
			ctx.lastCleanup = null
		}
	}, promiseTimeout * 2)

	const id = ctx.promises.length
	console.time(`execute-${id}`)

	const stack = new Error().stack

	const promise = new Promise<Action['result']>((resolve, reject) => {
		ctx.promises[id] = {
			engineId,
			action,
			resolve: (...params: unknown[]) => {
				clearTimeout(warning)

				return resolve(...(params as Parameters<typeof resolve>))
			},
			reject: (err: unknown) => {
				clearTimeout(warning)

				console.error(err)
				console.error(stack)
				console.error(new Error((err as Error).message, { cause: stack }))

				return reject(err)
			},
		}
	})

	worker.postMessage({ engineId: ctx.engineId, action, params, id })

	return promise
}

/**
 */
const wrappedPostMessage =
	(ctx: Ctx) =>
	<
		Actions extends WorkerEngineActions,
		ActionNames extends Actions['action'],
		Action extends WorkerEngineAction<Actions, ActionNames>,
	>(
		action: ActionNames,
		...params: Action['params']
	) =>
		postMessage<Actions, ActionNames, Action>(ctx, action, ...params)

/**
 */
const workerEngineConstruct = <Actions extends WorkerEngineActions>(
	ctx: Ctx<Actions>,
	options: {
		onSituationChange?: (engineId: number) => void
	}
) => {
	type Action<T extends Actions['action']> = WorkerEngineAction<Actions, T>

	const context = {
		engineId: ctx.engineId,
		worker: ctx.worker,
		isWorkerReady: ctx.isWorkerReady,
		onSituationChange: options.onSituationChange,
		postMessage: wrappedPostMessage(ctx),

		terminate: () => {
			context.worker.terminate()
			ctx.promises.forEach((promise) => promise.reject?.('worker terminated'))
			ctx.promises = []
		},

		/**
		 * This function is used to set the situation in the worker with a specific engineId.
		 */
		asyncSetSituation: async (
			...params: Action<'setSituation'>['params']
		): Promise<Action<'setSituation'>['result']> => {
			const ret = await context.postMessage('setSituation', ...params)

			context.onSituationChange?.(ctx.engineId)

			return ret
		},

		/**
		 * This function is used to evaluate a publicodes expression in the worker with a specific engineId.
		 */
		asyncEvaluate: async (
			...params: Action<'evaluate'>['params']
		): Promise<Action<'evaluate'>['result']> => {
			const promise = await context.postMessage('evaluate', ...params)

			// console.trace('{asyncEvaluate}')

			return promise
		},

		/**
		 * This function is used to get a publicodes rule that is in the worker with a specific EngineId.
		 */
		asyncGetRule: async (
			...params: Action<'getRule'>['params']
		): Promise<Action<'getRule'>['result']> => {
			return await context.postMessage('getRule', ...params)
		},

		/**
		 * This function is used to get all the parsed rules in the worker with a specific engineId.
		 */
		asyncGetParsedRules: async (): Promise<
			Action<'getParsedRules'>['result']
		> => {
			return await context.postMessage('getParsedRules')
		},

		/**
		 * This function is used to shallow copy an engine in the worker with a specific engineId.
		 */
		asyncShallowCopy: async (onSituationChange: () => void = () => {}) => {
			const engineId = await context.postMessage('shallowCopy')

			return workerEngineConstruct({ ...ctx, engineId }, { onSituationChange })
		},

		/**
		 * This function is used to delete a shallow copy of an engine in the worker.
		 */
		asyncDeleteShallowCopy: async (): Promise<
			Action<'deleteShallowCopy'>['result']
		> => {
			return context.postMessage('deleteShallowCopy')
		},
	}

	return context
}
