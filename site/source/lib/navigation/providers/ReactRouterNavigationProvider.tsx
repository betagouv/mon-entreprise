'use client'

import { ReactNode, useCallback, useEffect, useMemo, useRef } from 'react'
import {
	generatePath as rrGeneratePath,
	matchPath as rrMatchPath,
	useHref,
	useLocation,
	useNavigate,
	useNavigationType,
	useParams,
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
	const params = useParams()
	const navigationType = useNavigationType()
	const baseHref = useHref('.')

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

	const getHref = useCallback(
		(to: string) => {
			if (to.startsWith('/')) {
				return to
			}
			// Resolve relative path against current location
			const base = baseHref.endsWith('/') ? baseHref : baseHref + '/'

			return new URL(to, new URL(base, 'http://localhost')).pathname
		},
		[baseHref]
	)

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
			routeParams: params as Record<string, string>,
			locationHash: location.hash,
			locationState: location.state,
			navigationType,
			getHref,
			onNavigate,
			matchPath,
			generatePath: rrGeneratePath,
		}),
		[
			rrNavigate,
			location,
			searchParams,
			setSearchParams,
			params,
			navigationType,
			getHref,
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
