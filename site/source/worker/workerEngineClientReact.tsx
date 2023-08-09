import { DottedName } from 'modele-social'
import {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
	useTransition,
} from 'react'

import { useSetupSafeSituation } from '@/components/utils/EngineContext'
import { usePromise } from '@/hooks/usePromise'

import { Actions } from './socialWorkerEngine.worker'
import { WorkerEngineClient } from './workerEngineClient'

/**
 */
export const useSynchronizedWorkerEngine = (
	workerClient: WorkerEngineClient<Actions>
) => {
	const [transition, startTransition] = useTransition()

	const [situationVersion, setSituationVersion] = useState(0)
	const [workerEngine, setWorkerEngine] = useState<WorkerEngineClient<Actions>>(
		() => {
			workerClient.onSituationChange = function () {
				console.log('onSituationChange', workerClient.engineId)

				startTransition(() => {
					setSituationVersion((situationVersion) => {
						return situationVersion + 1
					})
				})
			}

			return workerClient
		}
	)

	const memo = useMemo(() => {
		return { ...workerEngine, situationVersion }
	}, [situationVersion, workerEngine])

	return memo
}

export type WorkerEngine = NonNullable<
	ReturnType<typeof useSynchronizedWorkerEngine>
>

const WorkerEngineContext = createContext<WorkerEngine>(
	undefined as unknown as WorkerEngine
)

/**
 */
export const useWorkerEngine = () => {
	const context = useContext(WorkerEngineContext)

	if (!context && !import.meta.env.SSR) {
		throw new Error(
			'You are trying to use the worker engine outside of its provider'
		)
	}

	return context
}

/**
 */
export const WorkerEngineProvider = ({
	workerClient,
	children,
}: {
	workerClient: WorkerEngineClient<Actions>
	children: React.ReactNode
}) => {
	const workerEngine = useSynchronizedWorkerEngine(workerClient)

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

interface Options<DefaultValue> {
	workerEngine?: WorkerEngine
	defaultValue?: DefaultValue
}

/**
 * This hook is used to get a rule in the worker engine.
 */
export const useAsyncGetRule = <
	DefaultValue = undefined, //
>(
	dottedName: DottedName,
	{ defaultValue, workerEngine: workerEngineOption }: Options<DefaultValue> = {}
) => {
	const defaultWorkerEngine = useWorkerEngine()
	const workerEngine = workerEngineOption ?? defaultWorkerEngine

	return usePromise(
		async () => workerEngine.asyncGetRule(dottedName),
		[dottedName, workerEngine],
		defaultValue
	)
}

/**
 * This hook is used to get parsed rules in the worker engine.
 */
export const useAsyncParsedRules = <
	DefaultValue = undefined, //
>({
	workerEngine: workerEngineOption,
	defaultValue,
}: Options<DefaultValue> = {}) => {
	const defaultWorkerEngine = useWorkerEngine()
	const workerEngine = workerEngineOption ?? defaultWorkerEngine

	return usePromise(
		async () => workerEngine.asyncGetParsedRules(),
		[workerEngine],
		defaultValue
	)
}

/**
 * This hook is used to make a shallow copy of the worker engine.
 */
export const useShallowCopy = (
	workerEngine: WorkerEngine
): WorkerEngine | undefined => {
	const [transition, startTransition] = useTransition()

	const [situationVersion, setSituationVersion] = useState(0)

	const workerEngineShallowCopy = usePromise(async () => {
		const copy = await workerEngine.asyncShallowCopy(() => {
			console.log('onSituationChange in shallow copy', copy.engineId)

			startTransition(() => {
				setSituationVersion((x) => x + 1)
			})
		})

		return copy
	}, [workerEngine])

	useEffect(
		() => () => {
			console.log('deleteShallowCopy', workerEngineShallowCopy?.engineId)

			void workerEngineShallowCopy?.asyncDeleteShallowCopy()
		},
		[workerEngineShallowCopy]
	)

	const memo = useMemo(
		() =>
			workerEngineShallowCopy
				? { ...workerEngineShallowCopy, situationVersion }
				: undefined,
		[situationVersion, workerEngineShallowCopy]
	)

	return memo
}

export function useInversionFail() {
	// return useContext(EngineContext).inversionFail()
}
