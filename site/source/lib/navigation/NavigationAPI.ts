import {
	AnchorHTMLAttributes,
	ComponentType,
	CSSProperties,
	ReactNode,
	Ref,
} from 'react'

export type NavigationType = 'PUSH' | 'POP' | 'REPLACE'

export type LinkTarget =
	| string
	| { pathname: string; search?: string; hash?: string }

export interface LinkProps extends Omit<
	AnchorHTMLAttributes<HTMLAnchorElement>,
	'href' | 'children'
> {
	to: LinkTarget
	children?: ReactNode
}

export type NavLinkState = {
	isActive: boolean
	isPending: boolean
	isTransitioning: boolean
}

export interface NavLinkProps extends Omit<
	AnchorHTMLAttributes<HTMLAnchorElement>,
	'href' | 'style' | 'className' | 'children'
> {
	to: LinkTarget
	end?: boolean
	ref?: Ref<HTMLAnchorElement>
	children?: ReactNode | ((state: NavLinkState) => ReactNode)
	style?: CSSProperties | ((state: NavLinkState) => CSSProperties | undefined)
	className?: string | ((state: NavLinkState) => string | undefined)
}

export function linkTargetToString(to: LinkTarget): string {
	if (typeof to === 'string') return to

	return `${to.pathname}${to.search ?? ''}${to.hash ?? ''}`
}

export interface NavigationAPI {
	Link: ComponentType<LinkProps>
	NavLink: ComponentType<NavLinkProps>
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
