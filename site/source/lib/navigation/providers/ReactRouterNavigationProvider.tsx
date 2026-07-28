import {
	ComponentType,
	ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useRef,
} from 'react'
import {
	generatePath as rrGeneratePath,
	Link as RRLink,
	matchPath as rrMatchPath,
	NavLink as RRNavLink,
	useHref as rrUseHref,
	useLocation,
	useNavigate,
	useNavigationType,
	useSearchParams,
} from 'react-router-dom'

import { LinkProps, NavigationAPI, NavLinkProps } from '../NavigationAPI'
import { NavigationContext } from '../NavigationContext'

interface Props {
	children: ReactNode
}

export function ReactRouterNavigationProvider({ children }: Props) {
	const rrNavigate = useNavigate()
	const location = useLocation()
	const [searchParams, rrSetSearchParams] = useSearchParams()
	const navigationType = useNavigationType()

	const rrSetSearchParamsRef = useRef(rrSetSearchParams)
	rrSetSearchParamsRef.current = rrSetSearchParams
	const setSearchParams = useCallback<NavigationAPI['setSearchParams']>(
		(params, options) => rrSetSearchParamsRef.current(params, options),
		[]
	)

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
			Link: RRLink as ComponentType<LinkProps>,
			NavLink: RRNavLink as ComponentType<NavLinkProps>,
			navigate: (to, options) => rrNavigate(to, options),
			currentPath: location.pathname,
			searchParams,
			setSearchParams,
			locationHash: location.hash,
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
