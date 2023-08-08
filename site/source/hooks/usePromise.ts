import { DependencyList, useCallback, useEffect, useState } from 'react'

/**
 * Execute an asynchronous function and return its result (Return default value if the promise is not finished).
 * The function is executed each time the dependencies change.
 */
export const usePromise = <T, Default = undefined>(
	promise: () => Promise<T>,
	deps: DependencyList,
	defaultValue?: Default
) => {
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const [state, lazyPromise] = useLazyPromise(promise, deps, defaultValue)

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => void lazyPromise(), deps)

	// cancelable promise
	// useEffect(() => {
	// 	const controller = new window.AbortController()
	// 	const signal = controller.signal

	// 	void new Promise((resolve, reject) => {
	// 		void lazyPromise().then(resolve)
	// 		// .then(resolve)

	// 		signal.addEventListener('abort', () => {
	// 			reject(new Error('Promise aborted'))
	// 		})
	// 	})

	// 	return () => {
	// 		console.log('### aborting')
	// 		controller.abort()
	// 		// promise.
	// 	}
	// }, deps)

	return state
}

/**
 * Return a typed tuple.
 */
const tuple = <T extends unknown[]>(args: [...T]): T => args

/**
 * Execute an asynchronous function and return its result (Return default value if the promise is not finished).
 * Use this hook if you want to fire the promise manually.
 */
export const useLazyPromise = <
	T,
	Params extends unknown[],
	Default = undefined,
>(
	promise: (...params: Params) => Promise<T>,
	deps: DependencyList,
	defaultValue?: Default
) => {
	const [state, setState] = useState<T | Default>(defaultValue as Default)

	const lazyPromise = useCallback(
		async (...params: Params) => {
			const result = await promise(...params)
			setState(result)

			return result as T
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		deps
	)

	return tuple([state, lazyPromise])
}
