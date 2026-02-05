'use client'

import { useEffect, useRef } from 'react'
import {
	generatePath as rrGeneratePath,
	matchPath as rrMatchPath,
	useHref as useRRHref,
	useLocation,
	useMatch,
	useParams,
	useNavigate as useRRNavigate,
	useSearchParams as useRRSearchParams,
} from 'react-router-dom'

export { rrGeneratePath as generatePath, rrMatchPath as matchPath }

/**
 * Hook unifié pour la navigation programmatique
 * Abstraction de useNavigate (react-router) pour future compatibilité Next.js
 */
export function useNavigate(): (to: string) => void {
	return useRRNavigate()
}

/**
 * Hook unifié pour obtenir le pathname courant
 * Abstraction de useLocation (react-router) pour future compatibilité Next.js
 */
export function useCurrentPath(): string {
	return useLocation().pathname
}

/**
 * Hook unifié pour les search params
 * Abstraction de useSearchParams (react-router) pour future compatibilité Next.js
 */
export function useQueryParams(): URLSearchParams {
	const [searchParams] = useSearchParams()

	return searchParams
}

/**
 * Hook unifié pour obtenir les paramètres de route
 * Abstraction de useParams (react-router) pour future compatibilité Next.js
 */
export function useRouteParams<T extends Record<string, string>>(): T {
	return useParams() as T
}

/**
 * Hook unifié pour obtenir le hash de l'URL (#section)
 * Abstraction de useLocation (react-router) pour future compatibilité Next.js
 */
export function useLocationHash(): string {
	return useLocation().hash
}

/**
 * Vérifie si le path actuel correspond à un pattern
 * Abstraction pour future compatibilité Next.js
 */
export function useMatchPath(pattern: string): boolean {
	const currentPath = useCurrentPath()

	if (pattern.endsWith('*')) {
		const prefix = pattern.slice(0, -1)

		return currentPath.startsWith(prefix)
	}

	return currentPath === pattern
}

/**
 * Vérifie si le path actuel correspond à un pattern et retourne les params
 * Abstraction de useMatch (react-router) pour future compatibilité Next.js
 */
export function useMatchWithParams<T extends Record<string, string>>(
	pattern: string
): T | null {
	const match = useMatch(pattern)

	return match?.params as T | null
}

/**
 * Hook unifié pour les search params avec setter
 * Abstraction de useSearchParams (react-router) pour future compatibilité Next.js
 */
export function useSearchParams() {
	return useRRSearchParams()
}

/**
 * Hook unifié pour obtenir l'URL href d'un path
 * Abstraction de useHref (react-router) pour future compatibilité Next.js
 */
export function useHref(to: string): string {
	return useRRHref(to)
}

/**
 * Hook pour exécuter un callback lors d'une navigation
 * Abstraction pour future compatibilité Next.js
 */
export function useOnNavigate(callback: () => void) {
	const location = useLocation()
	const isFirstRender = useRef(true)

	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false

			return
		}
		callback()
	}, [location, callback])
}
