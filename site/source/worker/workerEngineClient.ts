import type { WorkerEngineAction, WorkerEngineActions } from './workerEngine'

if (import.meta.env.SSR || !window.Worker) {
	throw new Error('Worker is not supported in this browser')
}

// const sleepMs = (ms: number) =>
// 	new Promise((resolve) => setTimeout(resolve, ms))

/**
 * This file is a client to communicate with workerEngine.
 */

export type WorkerEngineClient<
	Actions extends WorkerEngineActions<InitParams, Name>,
	InitParams extends unknown[] = unknown[],
	Name extends string = string,
> = ReturnType<typeof createWorkerEngineClient<Actions, InitParams, Name>>

export const createWorkerEngineClient = <
	Actions extends WorkerEngineActions<InitParams, Name>,
	InitParams extends unknown[] = unknown[],
	Name extends string = string,
>(
	worker: Worker,
	onSituationChange: (engineId: number) => void = () => {},
	...initParams: WorkerEngineAction<Actions, 'init'>['params']
) => {
	type Action<T extends Actions['action']> = WorkerEngineAction<Actions, T>

	const test = {
		onSituationChange: (engineId: number) => {},
	}

	console.log('{createWorker}')

	type WorkerEnginePromise<T extends Actions['action'] = Actions['action']> = {
		engineId: number
		action: T
		resolve: (value: unknown) => void
		reject: (value: unknown) => void
	}

	let promises: WorkerEnginePromise[] = []
	let lastCleanup: null | NodeJS.Timeout = null

	const postMessage = async <T extends Actions['action'], U extends Action<T>>(
		engineId: number,
		action: T,
		...params: U['params']
		// ...params: U['params'] extends [] ? [] : U['params']
	) => {
		console.log('{postMessage}', action, params)
		const promiseTimeout = 100000
		const warning = setTimeout(() => {
			console.log('{promise waiting for too long, aborting!}', action, params)
			promises[id].reject?.(new Error('timeout'))
		}, promiseTimeout)

		lastCleanup !== null && clearInterval(lastCleanup)
		lastCleanup = setTimeout(() => {
			if (promises.length) {
				console.log('{cleanup}', promises.length)
				promises = []
				lastCleanup = null
			}
		}, 200000)

		const id = promises.length
		console.time(`execute-${id}`)

		const stack = new Error().stack

		const promise = new Promise<U['result']>((resolve, reject) => {
			promises[id] = {
				engineId,
				action,
				resolve: (...params: unknown[]) => {
					clearTimeout(warning)

					return resolve(...(params as Parameters<typeof resolve>))
				},
				reject: (err) => {
					clearTimeout(warning)

					console.error(err)
					console.error(stack)
					console.error(new Error((err as Error).message, { cause: stack }))

					return reject(err)
				},
			}
		})

		worker.postMessage({ engineId, action, params, id })

		return promise
	}

	worker.onmessageerror = function (e) {
		console.log('{onmessageerror}', e)
	}

	worker.onerror = function (e) {
		console.log('{onerror}', e)
	}

	const ppp = (data) => {
		console.timeEnd(`execute-${data.id}`)
		if (data.id === 0) {
			console.timeEnd('loading')
		}

		if ('error' in data) {
			return promises[data.id].reject?.(data.error)
		}
		promises[data.id].resolve?.(data.result)
	}

	worker.onmessage = function (e) {
		console.log('{msg}', e.data)

		if ('batch' in e.data) {
			e.data.batch.forEach((data) => {
				ppp(data)
			})
		} else {
			ppp(e.data)
		}
	}

	const engineId = 0
	const isWorkerReady = postMessage(engineId, 'init', ...initParams)

	const workerEngineConstruct = (
		engineId: number,
		onSituationChange: (engineId: number) => void = () => {}
	) => ({
		test,
		engineId,
		worker,
		isWorkerReady,
		onSituationChange,
		// promises,
		postMessage,
		terminate: () => {
			workerEngine.worker.terminate()
			promises.forEach((promise) => promise.reject?.('worker terminated'))
			promises = []
		},

		// withEngineId: (engineId: number, promise: Promise) => {
		// 	const tmp = workerEngine.engineId
		// 	workerEngine.engineId = engineId

		// 	promise()

		// 	workerEngine.engineId = tmp
		// },

		// asynchronous setSituation function

		/**
		 * This function is used to set the situation in the worker with a specific engineId.
		 */
		asyncSetSituationWithEngineId: async (
			// engineId: number,
			...params: Action<'setSituation'>['params']
		): Promise<Action<'setSituation'>['result']> => {
			// abort every action "evaluate"

			console.log(')=>', promises)

			// promises.forEach((promise) => {
			// 	if (engineId === promise.engineId && promise.action === 'evaluate') {
			// 		promise.reject?.('abort')
			// 	}
			// })

			// if (!workerEngine.worker) {
			// 	await sleepMs(10)

			// 	return workerEngine.asyncSetSituationWithEngineId(engineId, ...params)
			// }

			// console.log('??? engideid', engineId, workerEngine, onSituationChange)

			const ret = await workerEngine.postMessage(
				engineId,
				'setSituation',
				...params
			)

			console.log('testtesttesttesttest', test)

			test.onSituationChange(engineId)

			return ret
		},

		/**
		 * This function is used to set the situation in the worker.
		 */
		// asyncSetSituation: async (...params: Action<'setSituation'>['params']) =>
		// 	workerEngine.asyncSetSituationWithEngineId(defaultEngineId, ...params),

		// asynchronous evaluate function

		/**
		 * This function is used to evaluate a publicodes expression in the worker with a specific engineId.
		 */
		asyncEvaluateWithEngineId: async (
			// engineId: number,
			...params: Action<'evaluate'>['params']
		): Promise<Action<'evaluate'>['result']> => {
			// if (!workerEngine.worker) {
			// 	await sleepMs(10)

			// 	return workerEngine.asyncEvaluateWithEngineId(engineId, ...params)
			// }

			const promise = await workerEngine.postMessage(
				engineId,
				'evaluate',
				...params
			)

			// console.trace('{asyncEvaluateWithEngineId}')

			return promise
		},

		/**
		 * This function is used to evaluate a publicodes expression in the worker.
		 */
		// asyncEvaluate: async (...params: Action<'evaluate'>['params']) =>
		// 	workerEngine.asyncEvaluateWithEngineId(defaultEngineId, ...params),

		// asynchronous getRule function:

		/**
		 * This function is used to get a publicodes rule that is in the worker with a specific EngineId.
		 */
		asyncGetRuleWithEngineId: async (
			// engineId: number,
			...params: Action<'getRule'>['params']
		): Promise<Action<'getRule'>['result']> => {
			// if (!workerEngine.worker) {
			// 	await sleepMs(10)

			// 	return workerEngine.asyncGetRuleWithEngineId(engineId, ...params)
			// }

			return await workerEngine.postMessage(engineId, 'getRule', ...params)
		},

		/**
		 * This function is used to get a rule in the worker.
		 */
		// asyncGetRule: async (...params: Action<'getRule'>['params']) =>
		// 	workerEngine.asyncGetRuleWithEngineId(defaultEngineId, ...params),

		// asynchronous getParsedRules function

		/**
		 * This function is used to get all the parsed rules in the worker with a specific engineId.
		 */
		asyncGetParsedRulesWithEngineId: async () // engineId: number
		: Promise<Action<'getParsedRules'>['result']> => {
			// if (!workerEngine.worker) {
			// 	await sleepMs(10)

			// 	return workerEngine.asyncGetParsedRulesWithEngineId(engineId)
			// }

			return await workerEngine.postMessage(engineId, 'getParsedRules')
		},

		/**
		 * This function is used to get all the parsed rules in the worker.
		 */
		// asyncGetParsedRules: async () =>
		// 	workerEngine.asyncGetParsedRulesWithEngineId(defaultEngineId),

		// asynchronous shallowCopy function

		/**
		 * This function is used to shallow copy an engine in the worker with a specific engineId.
		 */
		asyncShallowCopyWithEngineId: async (
			onSituationChange: () => void = () => {}
		) => {
			// engineId: number
			// if (!workerEngine.worker) {
			// 	await sleepMs(10)

			// 	return workerEngine.asyncShallowCopyWithEngineId(engineId)
			// }

			const newEngineId = await workerEngine.postMessage(
				engineId,
				'shallowCopy'
			)

			// return {
			// 	...workerEngine,
			// 	engineId: newEngineId,
			// }

			// const uu = Object.assign({}, workerEngine)
			// uu.engineId = newEngineId

			// console.log('???[newEngineId]', newEngineId, engineId)

			return workerEngineConstruct(newEngineId, onSituationChange)
		},

		/**
		 * This function is used to shallow copy an engine in the worker.
		 */
		// asyncShallowCopy: async () => ({
		// 	...context,
		// 	engineId: await workerEngine.asyncShallowCopyWithEngineId(
		// 		defaultEngineId
		// 	),
		// }),

		// asynchronous deleteShallowCopy function

		/**
		 * 	* This function is used to delete a shallow copy of an engine in the worker.
		 */
		asyncDeleteShallowCopy: async () // engineId: number
		: Promise<Action<'deleteShallowCopy'>['result']> => {
			// if (!workerEngine.worker) {
			// 	await sleepMs(10)

			// 	return workerEngine.asyncDeleteShallowCopy(engineId)
			// }

			return await workerEngine.postMessage(engineId, 'deleteShallowCopy')
		},
	})
	const workerEngine = workerEngineConstruct(engineId, onSituationChange)

	return workerEngine
}
