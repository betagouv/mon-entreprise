'use client'

import { ReactNode, useCallback, useMemo, useRef, useState } from 'react'
import {
	generatePath as rrGeneratePath,
	matchPath as rrMatchPath,
} from 'react-router-dom'

import { NavigationAPI, NavigationType } from '../NavigationAPI'
import { NavigationContext } from '../NavigationContext'

interface Props {
	children: ReactNode
	initialPath?: string
	initialSearchParams?: URLSearchParams
	initialRouteParams?: Record<string, string>
	initialHash?: string
	initialState?: unknown
	initialNavigationType?: NavigationType
}

export function MockNavigationProvider({
	children,
	initialPath = '/',
	initialSearchParams,
	initialRouteParams = {},
	initialHash = '',
	initialState = null,
	initialNavigationType = 'PUSH',
}: Props) {
	const [currentPath, setCurrentPath] = useState(initialPath)
	const [searchParams, setSearchParamsState] = useState(
		initialSearchParams ?? new URLSearchParams()
	)
	const [locationHash, setLocationHash] = useState(initialHash)

	const subscribersRef = useRef(new Set<() => void>())

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
			const base = currentPath.endsWith('/') ? currentPath : currentPath + '/'

			return new URL(to, new URL(base, 'http://localhost')).pathname
		},
		[currentPath]
	)

	const matchPath = useCallback(
		(pattern: string, pathname?: string) => {
			const match = rrMatchPath(pattern, pathname ?? currentPath)

			return match ? { params: match.params as Record<string, string> } : null
		},
		[currentPath]
	)

	const navigation = useMemo<NavigationAPI>(
		() => ({
			navigate: (to) => {
				const url = new URL(to, 'http://localhost')
				setCurrentPath(url.pathname)
				setSearchParamsState(url.searchParams)
				setLocationHash(url.hash)
				subscribersRef.current.forEach((callback) => callback())
			},
			currentPath,
			searchParams,
			setSearchParams: (params) => {
				if (typeof params === 'function') {
					setSearchParamsState(params)
				} else {
					setSearchParamsState(params)
				}
			},
			routeParams: initialRouteParams,
			locationHash,
			locationState: initialState,
			navigationType: initialNavigationType,
			getHref,
			onNavigate,
			matchPath,
			generatePath: rrGeneratePath,
		}),
		[
			currentPath,
			searchParams,
			locationHash,
			initialRouteParams,
			initialState,
			initialNavigationType,
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
