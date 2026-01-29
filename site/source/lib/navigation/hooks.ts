'use client'

import {
	useLocation,
	useParams,
	useNavigate as useRRNavigate,
	useSearchParams,
} from 'react-router-dom'

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
