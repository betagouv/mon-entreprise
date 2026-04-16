import { AnchorHTMLAttributes, ComponentType, ReactNode } from 'react'

export type NavigationType = 'PUSH' | 'POP' | 'REPLACE'

export type LinkTarget =
	| string
	| { pathname: string; search?: string; hash?: string }

export interface LinkProps
	extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'children'> {
	to: LinkTarget
	children?: ReactNode
}

export function linkTargetToString(to: LinkTarget): string {
	if (typeof to === 'string') return to

	return `${to.pathname}${to.search ?? ''}${to.hash ?? ''}`
}

export interface NavigationAPI {
	Link: ComponentType<LinkProps>
	navigate: (to: string, options?: { replace?: boolean }) => void
	currentPath: string
	searchParams: URLSearchParams
	setSearchParams: (
		params:
			| URLSearchParams
			| Record<string, string>
			| ((prev: URLSearchParams) => URLSearchParams),
		options?: { replace?: boolean }
	) => void
	locationHash: string
	navigationType: NavigationType
	getHref: (to: string) => string
	onNavigate: (callback: () => void) => () => void
	matchPath: (
		pattern: string,
		pathname?: string
	) => { params: Record<string, string> } | null
	generatePath: (pattern: string, params?: Record<string, string>) => string
}
