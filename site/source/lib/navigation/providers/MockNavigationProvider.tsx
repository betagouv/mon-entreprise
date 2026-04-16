import { ReactNode, useCallback, useMemo, useRef, useState } from 'react'
import {
	generatePath as rrGeneratePath,
	matchPath as rrMatchPath,
} from 'react-router-dom'

import {
	LinkProps,
	linkTargetToString,
	NavigationAPI,
	NavigationType,
} from '../NavigationAPI'
import { NavigationContext } from '../NavigationContext'

function MockLink({ to, children, ...props }: LinkProps) {
	return (
		<a href={linkTargetToString(to)} {...props}>
			{children}
		</a>
	)
}

interface Props {
	children: ReactNode
	initialPath?: string
	initialSearchParams?: URLSearchParams
	initialHash?: string
	initialNavigationType?: NavigationType
}

export function MockNavigationProvider({
	children,
	initialPath = '/',
	initialSearchParams,
	initialHash = '',
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
			Link: MockLink,
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
				} else if (params instanceof URLSearchParams) {
					setSearchParamsState(params)
				} else {
					setSearchParamsState(new URLSearchParams(params))
				}
			},
			locationHash,
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
