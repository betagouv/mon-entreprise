'use client'

import NextLink from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
	ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react'

import {
	LinkProps,
	linkTargetToString,
	NavigationAPI,
	NavigationType,
} from '../NavigationAPI'
import { NavigationContext } from '../NavigationContext'
import { generatePath, matchPath } from '../pathUtils'

function NextJsLink({ to, children, ...props }: LinkProps) {
	return (
		<NextLink href={linkTargetToString(to)} {...props}>
			{children}
		</NextLink>
	)
}

interface Props {
	children: ReactNode
}

export function NextJsNavigationProvider({ children }: Props) {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()

	const subscribersRef = useRef(new Set<() => void>())
	const previousPathnameRef = useRef(pathname)

	const [locationHash, setLocationHash] = useState(() =>
		typeof window !== 'undefined' ? window.location.hash : ''
	)
	const [navigationType, setNavigationType] = useState<NavigationType>('PUSH')

	useEffect(() => {
		if (previousPathnameRef.current !== pathname) {
			previousPathnameRef.current = pathname
			subscribersRef.current.forEach((callback) => callback())
		}
	}, [pathname])

	useEffect(() => {
		const onHashChange = () => setLocationHash(window.location.hash)
		const onPopState = () => {
			setNavigationType('POP')
			setLocationHash(window.location.hash)
		}
		window.addEventListener('hashchange', onHashChange)
		window.addEventListener('popstate', onPopState)

		return () => {
			window.removeEventListener('hashchange', onHashChange)
			window.removeEventListener('popstate', onPopState)
		}
	}, [])

	const onNavigate = useCallback((callback: () => void) => {
		subscribersRef.current.add(callback)

		return () => {
			subscribersRef.current.delete(callback)
		}
	}, [])

	const navigate = useCallback(
		(to: string, options?: { replace?: boolean }) => {
			setNavigationType(options?.replace ? 'REPLACE' : 'PUSH')
			if (options?.replace) {
				router.replace(to)
			} else {
				router.push(to)
			}
		},
		[router]
	)

	const setSearchParams = useCallback(
		(
			params:
				| URLSearchParams
				| Record<string, string>
				| ((prev: URLSearchParams) => URLSearchParams),
			options?: { replace?: boolean }
		) => {
			const newParams =
				typeof params === 'function'
					? params(new URLSearchParams(searchParams.toString()))
					: params instanceof URLSearchParams
					? params
					: new URLSearchParams(params)

			const hash = typeof window !== 'undefined' ? window.location.hash : ''
			const queryString = newParams.toString()
			const url = `${pathname}${queryString ? `?${queryString}` : ''}${hash}`

			navigate(url, options)
		},
		[pathname, searchParams, navigate]
	)

	const getHref = useCallback(
		(to: string) => {
			if (to.startsWith('/')) {
				return to
			}

			return new URL(to, new URL(pathname, 'http://localhost/')).pathname
		},
		[pathname]
	)

	const matchPathForPathname = useCallback(
		(pattern: string, path?: string) => matchPath(pattern, path ?? pathname),
		[pathname]
	)

	const navigation = useMemo<NavigationAPI>(
		() => ({
			Link: NextJsLink,
			navigate,
			currentPath: pathname,
			searchParams: new URLSearchParams(searchParams.toString()),
			setSearchParams,
			locationHash,
			navigationType,
			getHref,
			onNavigate,
			matchPath: matchPathForPathname,
			generatePath,
		}),
		[
			navigate,
			pathname,
			searchParams,
			setSearchParams,
			locationHash,
			navigationType,
			getHref,
			onNavigate,
			matchPathForPathname,
		]
	)

	return (
		<NavigationContext.Provider value={navigation}>
			{children}
		</NavigationContext.Provider>
	)
}
