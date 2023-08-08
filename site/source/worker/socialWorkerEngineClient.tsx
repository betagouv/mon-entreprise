import { DottedName } from 'modele-social'
import {
	createContext,
	DependencyList,
	useContext,
	useEffect,
	useMemo,
	useState,
	useTransition,
} from 'react'

import { ProviderProps } from '@/components/Provider'
import { useSetupSafeSituation } from '@/components/utils/EngineContext'
import { useLazyPromise, usePromise } from '@/hooks/usePromise'

import { Actions } from './socialWorkerEngine.worker'
import {
	createWorkerEngineClient,
	WorkerEngineClient,
} from './workerEngineClient'

export type WorkerEngine = NonNullable<ReturnType<typeof useCreateWorkerEngine>>

// @ts-expect-error
const WorkerEngineContext = createContext<WorkerEngine>()

// export const useWorkerEngineContext = () => {
// 	const context = useContext(WorkerEngineContext)
// 	if (!context) {
// 		throw new Error(
// 			'You are trying to use the worker engine outside of its provider'
// 		)
// 	}

// 	return context
// }

export const useWorkerEngine = () => {
	const context = useContext(WorkerEngineContext)

	if (!context && !import.meta.env.SSR) {
		throw new Error(
			'You are trying to use the worker engine outside of its provider'
		)
	}

	// if (!context) {
	// 	throw new Error(
	// 		'You are trying to use the worker engine before it is ready'
	// 	)
	// }

	return context
}

export const WorkerEngineProvider = ({
	children,
	basename,
	workerClient,
}: {
	children: React.ReactNode
	basename: ProviderProps['basename']
	workerClient: WorkerEngineClient<Actions>
}) => {
	const workerEngine = useCreateWorkerEngine(basename, workerClient)

	useSetupSafeSituation(workerEngine)

	if (workerEngine === undefined) {
		return children
	}

	return (
		<WorkerEngineContext.Provider value={workerEngine}>
			{children}
		</WorkerEngineContext.Provider>
	)
}

// export type WorkerEngine = WorkerEngineClient<Actions>
// let workerClient: | null = null
// setTimeout(() => {
// const preparedWorker = new SocialeWorkerEngine()
// const workerClient: WorkerEngineClient<Actions> =
// 	createWorkerEngineClient<Actions>(
// 		new SocialeWorkerEngine(),
// 		() => {},
// 		// (engineId) =>
// 		// 	setSituationVersion((situationVersion) => {
// 		// 		// console.log('??? setSituationVersion original')

// 		// 		// situationVersion[engineId] =
// 		// 		// 	typeof situationVersion[engineId] !== 'number'
// 		// 		// 		? 0
// 		// 		// 		: situationVersion[engineId]++

// 		// 		// return situationVersion
// 		// 		return situationVersion + 1
// 		// 	}),
// 		{ basename: 'mon-entreprise' }
// 	)
// workerClient.test.onSituationChange = function (engineId) {
// 	console.log('original onSituationChange')
// }
// // }, 50)
// console.time('loading')

/**
 * This hook is used to create a worker engine.
 * @param basename
 */
export const useCreateWorkerEngine = (
	basename: ProviderProps['basename'],
	workerClient: WorkerEngineClient<Actions>
) => {
	const [situationVersion, setSituationVersion] = useState(0)
	const [workerEngine, setWorkerEngine] =
		useState<WorkerEngineClient<Actions>>(workerClient)
	// console.log('llllllpppppppppppppppppppppppppp', workerClient)

	const [transition, startTransition] = useTransition()

	useEffect(() => {
		console.timeEnd('time')
		// const workerClient = createWorkerEngineClient<Actions>(
		// 	new SocialeWorkerEngine(),
		// 	// () => {},
		// 	// () =>
		// 	// 	startTransition(() => {
		// 	// 		setSituationVersion((situationVersion) => {
		// 	// 			// console.log('??? setSituationVersion original')

		// 	// 			// situationVersion[engineId] =
		// 	// 			// 	typeof situationVersion[engineId] !== 'number'
		// 	// 			// 		? 0
		// 	// 			// 		: situationVersion[engineId]++

		// 	// 			// return situationVersion
		// 	// 			return situationVersion + 1
		// 	// 		})
		// 	// 	}),
		// 	//
		// 	{
		// 		initParams: [{ basename: 'mon-entreprise' }],
		// 		onSituationChange: function () {
		// 			console.log('update *****************')

		// 			startTransition(() => {
		// 				setSituationVersion((situationVersion) => {
		// 					return situationVersion + 1
		// 				})
		// 			})
		// 		},
		// 	}
		// )

		workerClient.onSituationChange = function () {
			console.log('update *****************')

			startTransition(() => {
				setSituationVersion((situationVersion) => {
					return situationVersion + 1
				})
			})
		}

		// workerClient.context.onSituationChange = function () {
		// 	console.log('update !!!!!!!!!!!!!!!!!!')

		// 	console.log('transition...')

		// 	startTransition(() => {
		// 		setSituationVersion((situationVersion) => {
		// 			// console.log('??? setSituationVersion original')

		// 			// situationVersion[engineId] =
		// 			// 	typeof situationVersion[engineId] !== 'number'
		// 			// 		? 0
		// 			// 		: situationVersion[engineId]++

		// 			// return situationVersion
		// 			return situationVersion + 1
		// 		})
		// 	})
		// }

		console.log('{init worker}', workerClient)
		setWorkerEngine(workerClient)

		// void workerClient.context.asyncSetSituation({})

		console.time('{init}')
		let init = false
		void workerClient.isWorkerReady.finally(() => {
			init = true
			console.timeEnd('{init}')
		})

		// example of usage
		// void Promise.all([
		// 	workerClient
		// 		.asyncEvaluate('SMIC')
		// 		.then((result) => console.log('{result}', result)),
		// 	workerClient
		// 		.asyncEvaluate('date')
		// 		.then((result) => console.log('{result}', result)),
		// ])

		return () => {
			!init && console.timeEnd('{init}')
			console.log('{terminate worker}', workerClient)

			// workerClient.terminate()
		}
	}, [basename])

	// return workerEngine ? { ...workerEngine, situationVersion } : null
	const memo = useMemo(() => {
		// console.log('update:', { situationVersion, workerEngine })

		return workerEngine ? { ...workerEngine, situationVersion } : undefined
	}, [situationVersion, workerEngine])

	return memo
}

/**
 *
 */
// const useSituationVersion = (workerEngineCtx: WorkerEngineCtx) =>
// 	workerEngineCtx.situationVersion
// [engineId]

interface Options<Default> {
	defaultValue?: Default
	workerEngine?: WorkerEngine
}

/**
 * Wrapper around usePromise that adds the situation version to the dependencies
 * @example const date = usePromiseOnSituationChange(() => asyncEvaluate('date'), []) // date will be updated when the situation changes
 * @deprecated
 */
export const usePromiseOnSituationChange = <T, Default = undefined>(
	promise: () => Promise<T>,
	deps: DependencyList,
	{ defaultValue, workerEngine: workerEngineOption }: Options<Default> = {}
): T | Default => {
	const defaultWorkerEngineCtx = useWorkerEngine()
	const { situationVersion } = workerEngineOption ?? defaultWorkerEngineCtx

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const state = usePromise(promise, [...deps, situationVersion], defaultValue)

	return state
}

/**
 * @deprecated
 */
export const useLazyPromiseOnSituationChange = <T, Default = undefined>(
	promise: () => Promise<T>,
	deps: DependencyList,
	{ defaultValue, workerEngine: workerEngineOption }: Options<Default> = {}
): [T | Default, () => Promise<T>] => {
	const defaultWorkerEngineCtx = useWorkerEngine()
	const { situationVersion } = workerEngineOption ?? defaultWorkerEngineCtx

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const tuple = useLazyPromise(
		promise,
		[...deps, situationVersion],
		defaultValue
	)

	return tuple
}

/**
 * This hook is used to get a rule in the worker.
 * @param dottedName
 * @param options
 */
export const useAsyncGetRule = <
	// T extends unknown = undefined,
	Default = undefined,
>(
	dottedName: DottedName,
	{ defaultValue, workerEngine: workerEngineOption }: Options<Default> = {}
) => {
	const defaultWorkerEngine = useWorkerEngine()
	const workerEngine = workerEngineOption ?? defaultWorkerEngine

	return usePromiseOnSituationChange(
		async () => workerEngine.asyncGetRule(dottedName),
		[dottedName, workerEngine],
		{ defaultValue, workerEngine }
	)
}

/**
 * This hook is used to get parsed rules in the worker.
 * @param engineId
 */
export const useAsyncParsedRules = <
	Default = undefined, //
>({
	defaultValue,
	workerEngine: workerEngineOption,
}: Options<Default> = {}) => {
	const defaultWorkerEngine = useWorkerEngine()
	const workerEngine = workerEngineOption ?? defaultWorkerEngine

	return usePromiseOnSituationChange(
		async () => workerEngine.asyncGetParsedRules(),
		[workerEngine],
		{ defaultValue, workerEngine }
	)
}

export const useShallowCopy = (
	workerEngine: WorkerEngine
): WorkerEngine | undefined => {
	const [situationVersion, setSituationVersion] = useState(0)

	// const defaultWorkerEngine = useWorkerEngine()
	// const workerEngine = workerEngineParam
	// ?? defaultWorkerEngine

	// console.log('??? situ version', situationVersion)

	const workerEngineCopy = usePromiseOnSituationChange(
		async () => {
			const copy = await workerEngine.asyncShallowCopy(() => {
				// console.log('??? onSituationChange', copy)

				setSituationVersion((x) => x + 1)
			})

			// copy.onSituationChange = (x) => {
			// 	console.log('??? onSituationChange', copy)

			// 	setSituationVersion(x)
			// }

			// console.log('??? xxxxxxxxxxxxxxxxxxxxxxxxxxx', copy)

			return copy
		},
		[workerEngine],
		{ defaultValue: undefined, workerEngine }
	)

	const memo = useMemo(
		() =>
			workerEngineCopy ? { ...workerEngineCopy, situationVersion } : undefined,
		[situationVersion, workerEngineCopy]
	)

	return memo
}
