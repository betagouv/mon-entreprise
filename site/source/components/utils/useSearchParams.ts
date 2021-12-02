// backported from react-router 6
// https://github.com/ReactTraining/react-router/blob/a97dbdb7297474ff0114411e363db2c8fb417e55/packages/react-router-dom/index.tsx#L383

import { useCallback, useMemo, useRef } from 'react'
import { useLocation, useHistory } from 'react-router-dom'

export type ParamKeyValuePair = [string, string]
export type URLSearchParamsInit =
	| string
	| ParamKeyValuePair[]
	| Record<string, string | string[]>
	| URLSearchParams

export function useSearchParams(defaultInit?: URLSearchParamsInit) {
	const defaultSearchParamsRef = useRef(createSearchParams(defaultInit))

	const location = useLocation()
	const searchParams = useMemo(() => {
		const searchParams = createSearchParams(location.search)

		for (const key of defaultSearchParamsRef.current.keys()) {
			if (!searchParams.has(key)) {
				defaultSearchParamsRef.current.getAll(key).forEach((value) => {
					searchParams.append(key, value)
				})
			}
		}

		return searchParams
	}, [location.search])

	const history = useHistory()
	const setSearchParams = useCallback(
		(
			nextInit: URLSearchParamsInit,
			navigateOptions?: { replace?: boolean }
		) => {
			if (navigateOptions?.replace) {
				history.replace('?' + createSearchParams(nextInit))
			} else {
				history.push('?' + createSearchParams(nextInit))
			}
		},
		[history]
	)

	return [searchParams, setSearchParams] as const
}

export function createSearchParams(
	init: URLSearchParamsInit = ''
): URLSearchParams {
	return new URLSearchParams(
		typeof init === 'string' ||
		Array.isArray(init) ||
		init instanceof URLSearchParams
			? init
			: Object.keys(init).reduce((memo, key) => {
					const value = init[key]
					return memo.concat(
						Array.isArray(value) ? value.map((v) => [key, v]) : [[key, value]]
					)
			  }, [] as ParamKeyValuePair[])
	)
}
