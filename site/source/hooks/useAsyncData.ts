import { DependencyList, useEffect, useRef } from 'react'

/**
 * Executes a function that returns a promise (when dependencies change)
 * and returns the result of the promise when completed
 */
export const useAsyncData = <T, U = null>(
	getAsyncData: () => Promise<T>,
	defaultValue: U | null = null,
	deps: DependencyList = []
): T | U | null => {
	const data = useRef<T | U | null>(defaultValue)

	useEffect(() => {
		void (async () => {
			data.current = await getAsyncData()
		})()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, deps)

	return data.current
}
