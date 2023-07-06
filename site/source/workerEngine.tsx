import { DottedName } from 'modele-social'
import React, { DependencyList, useContext, useEffect, useState } from 'react'

import { ProviderProps } from './components/Provider'
import type { Action, Actions } from './engine.worker'
import EngineWorker from './engine.worker?worker'
import { usePromise } from './hooks/usePromise'

if (!window.Worker) {
	throw new Error('Worker is not supported in this browser')
}

interface WorkerEngine {
	worker: Worker
	postMessage: <T extends Actions['action'], U extends Action<T>>(
		engineId: number,
		action: T,
		...params: U['params']
	) => Promise<U['result']>
	isWorkerReady: Promise<void>
	promises: {
		resolve: (value: unknown) => void
		reject: (value: unknown) => void
	}[]
}

const initWorkerEngine = (
	basename: ProviderProps['basename'],
	setSituationVersion: (updater: (situationVersion: number) => number) => void
) => {
	const newWorker: Worker = new EngineWorker()

	const promises: WorkerEngine['promises'] = []

	const postMessage = async <T extends Actions['action'], U extends Action<T>>(
		engineId: number,
		action: T,
		...params: U['params']
	) => {
		if (action === 'setSituation') {
			setSituationVersion((situationVersion) => situationVersion + 1)
		}

		const warning = setTimeout(() => {
			console.log('promise waiting for too long, aborting!', action, params)
			promises[id].reject?.(new Error('timeout'))
		}, 5000)

		const id = promises.length
		const promise = new Promise<U['result']>((resolve, reject) => {
			promises[id] = {
				resolve(...params: unknown[]) {
					clearTimeout(warning)

					return resolve(...(params as Parameters<typeof resolve>))
				},
				reject(err) {
					clearTimeout(warning)

					return reject(err)
				},
			}
		})

		newWorker.postMessage({ engineId, action, params, id })

		return promise
	}

	newWorker.onmessage = function (e) {
		console.log('msg:', e.data)
		if ('error' in e.data) {
			return promises[e.data.id].reject?.(e.data.error)
		}
		promises[e.data.id].resolve?.(e.data.result)
	}

	const isWorkerReady = postMessage(0, 'init', { basename })

	const workerEngine = {
		worker: newWorker,
		postMessage,
		isWorkerReady,
		promises,
	}

	return workerEngine
}

const sleepMs = (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms))

let worker: ReturnType<typeof initWorkerEngine> | null = null

/**
 * This hook is used to create a worker engine.
 * @param basename
 */
const useCreateWorkerEngine = (basename: ProviderProps['basename']) => {
	const [situationVersion, setSituationVersion] = useState(0)

	useEffect(() => {
		worker = initWorkerEngine(basename, setSituationVersion)

		console.time('init')
		void worker.isWorkerReady.then(() => console.timeEnd('init'))

		// example of usage
		void Promise.all([
			asyncEvaluate('SMIC').then((result) => console.log('result', result)),
			asyncEvaluate('date').then((result) => console.log('result', result)),
		])

		return () => {
			console.log('worker terminated!')

			worker?.worker.terminate()
			worker?.promises.forEach((promise) =>
				promise.reject?.('worker terminated')
			)
			worker = null
		}
	}, [basename])

	return situationVersion
}

// asynchronous setSituation function

/**
 * This function is used to set the situation in the worker with a specific engineId.
 */
export const asyncSetSituationWithEngineId = async (
	engineId: number,
	...params: Action<'setSituation'>['params']
): Promise<Action<'setSituation'>['result']> => {
	if (!worker) {
		await sleepMs(10)

		return asyncSetSituationWithEngineId(engineId, ...params)
	}

	return await worker.postMessage(engineId, 'setSituation', ...params)
}

/**
 * 	* This function is used to set the situation in the worker.
 */
export const asyncSetSituation = async (
	...params: Action<'setSituation'>['params']
) => asyncSetSituationWithEngineId(0, ...params)

// asynchronous evaluate function

/**
 * This function is used to evaluate a publicodes expression in the worker with a specific engineId.
 */
export const asyncEvaluateWithEngineId = async (
	engineId: number,
	...params: Action<'evaluate'>['params']
): Promise<Action<'evaluate'>['result']> => {
	if (!worker) {
		await sleepMs(10)

		return asyncEvaluateWithEngineId(engineId, ...params)
	}

	return await worker.postMessage(engineId, 'evaluate', ...params)
}

/**
 * This function is used to evaluate a publicodes expression in the worker.
 */
export const asyncEvaluate = async (...params: Action<'evaluate'>['params']) =>
	asyncEvaluateWithEngineId(0, ...params)

/**
 * This hook is used to evaluate a publicodes expression in the worker.
 * @param defaultValue
 */
// export const useAsyncEvaluate = <T extends unknown = undefined>(
// 	defaultValue?: T
// ) => {
// 	const [response, setResponse] = useState<Action<'evaluate'>['result'] | T>(
// 		defaultValue as T
// 	)

// 	const evaluate = useCallback(async (value: PublicodesExpression) => {
// 		const result = await asyncEvaluate(value)
// 		setResponse(result)

// 		return result
// 	}, [])

// 	return [response, evaluate] as const
// }

// asynchronous getRule function:

/**
 * This function is used to get a publicodes rule that is in the worker with a specific EngineId.
 */
export const asyncGetRuleWithEngineId = async (
	engineId: number,
	...params: Action<'getRule'>['params']
): Promise<Action<'getRule'>['result']> => {
	if (!worker) {
		await sleepMs(10)

		return asyncGetRuleWithEngineId(engineId, ...params)
	}

	return await worker.postMessage(engineId, 'getRule', ...params)
}

/**
 * This function is used to get a rule in the worker.
 */
export const asyncGetRule = async (...params: Action<'getRule'>['params']) =>
	asyncGetRuleWithEngineId(0, ...params)

/**
 * This hook is used to get a rule in the worker.
 * @param defaultValue
 */
export const useAsyncGetRule = <
	Names extends DottedName,
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
	T extends unknown = undefined
>(
	dottedName: Names,
	defaultValue?: T
) =>
	usePromiseOnSituationChange(
		() => asyncGetRule(dottedName),
		[dottedName],
		defaultValue
	)

// asynchronous getParsedRules function

/**
 * This function is used to get all the parsed rules in the worker with a specific engineId.
 */
export const asyncGetParsedRulesWithEngineId = async (
	engineId: number
): Promise<Action<'getParsedRules'>['result']> => {
	if (!worker) {
		await sleepMs(10)

		return asyncGetParsedRulesWithEngineId(engineId)
	}

	return await worker.postMessage(engineId, 'getParsedRules')
}

/**
 * This function is used to get all the parsed rules in the worker.
 */
export const asyncGetParsedRules = async () =>
	asyncGetParsedRulesWithEngineId(0)

/**
 *
 */
export const useParsedRules = (engineId = 0) =>
	usePromiseOnSituationChange(
		async () => await asyncGetParsedRulesWithEngineId(engineId),
		[engineId]
	)

// asynchronous shallowCopy function

/**
 * This function is used to shallow copy an engine in the worker with a specific engineId.
 */
export const asyncShallowCopyWithEngineId = async (
	engineId: number
): Promise<Action<'shallowCopy'>['result']> => {
	if (!worker) {
		await sleepMs(10)

		return asyncShallowCopyWithEngineId(engineId)
	}

	return await worker.postMessage(engineId, 'shallowCopy')
}

/**
 * This function is used to shallow copy an engine in the worker.
 */
export const asyncShallowCopy = async () => asyncShallowCopyWithEngineId(0)

// asynchronous deleteShallowCopy function

/**
 * 	* This function is used to delete a shallow copy of an engine in the worker.
 */
export const asyncDeleteShallowCopy = async (
	engineId: number
): Promise<Action<'deleteShallowCopy'>['result']> => {
	if (!worker) {
		await sleepMs(10)

		return asyncDeleteShallowCopy(engineId)
	}

	return await worker.postMessage(0, 'deleteShallowCopy', { engineId })
}

const SituationUpdated = React.createContext<number>(0)

export const SituationUpdatedProvider = ({
	children,
	basename,
}: {
	children: React.ReactNode
	basename: ProviderProps['basename']
}) => {
	const situationVersion = useCreateWorkerEngine(basename)

	return (
		<SituationUpdated.Provider value={situationVersion}>
			{children}
		</SituationUpdated.Provider>
	)
}

export const useSituationUpdated = () => {
	const situationVersion = useContext(SituationUpdated)

	return situationVersion
}

/**
 * Wrapper around usePromise that adds the situation version to the dependencies
 * @example const date = usePromiseOnSituationChange(() => asyncEvaluate('date'), []) // date will be updated when the situation changes
 */
export const usePromiseOnSituationChange = <T, Default = undefined>(
	promise: () => Promise<T>,
	deps: DependencyList,
	defaultValue?: Default
): T | Default => {
	const situationVersion = useSituationUpdated()

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const state = usePromise(promise, [...deps, situationVersion], defaultValue)

	return state
}
