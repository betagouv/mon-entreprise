import { ReactNode, useCallback, useEffect, useMemo, useRef } from 'react'
import {
	generatePath as rrGeneratePath,
	matchPath as rrMatchPath,
	useHref as rrUseHref,
	useLocation,
	useNavigate,
	useNavigationType,
	useSearchParams,
} from 'react-router-dom'

import { NavigationAPI } from '../NavigationAPI'
import { NavigationContext } from '../NavigationContext'

interface Props {
	children: ReactNode
}

export function ReactRouterNavigationProvider({ children }: Props) {
	const rrNavigate = useNavigate()
	const location = useLocation()
	const [searchParams, setSearchParams] = useSearchParams()
	const navigationType = useNavigationType()

	const subscribersRef = useRef(new Set<() => void>())
	const isFirstRenderRef = useRef(true)

	useEffect(() => {
		if (isFirstRenderRef.current) {
			isFirstRenderRef.current = false

			return
		}
		subscribersRef.current.forEach((callback) => callback())
	}, [location])

	const onNavigate = useCallback((callback: () => void) => {
		subscribersRef.current.add(callback)

		return () => {
			subscribersRef.current.delete(callback)
		}
	}, [])

	const matchPath = useCallback(
		(pattern: string, pathname?: string) => {
			const match = rrMatchPath(pattern, pathname ?? location.pathname)

			return match ? { params: match.params as Record<string, string> } : null
		},
		[location.pathname]
	)

	const navigation = useMemo<NavigationAPI>(
		() => ({
			navigate: (to, options) => rrNavigate(to, options),
			currentPath: location.pathname,
			searchParams,
			setSearchParams,
			locationHash: location.hash,
			locationState: location.state,
			navigationType,
			getHref: (to) => rrUseHref(to),
			onNavigate,
			matchPath,
			generatePath: rrGeneratePath,
		}),
		[
			rrNavigate,
			location,
			searchParams,
			setSearchParams,
			navigationType,
			onNavigate,
			matchPath,
		]
	)

	return (
		<NavigationContext.Provider value={navigation}>
			{children}
		</NavigationContext.Provider>
	)
}
