export type NavigationType = 'PUSH' | 'POP' | 'REPLACE'

export interface NavigationAPI {
	navigate: (
		to: string,
		options?: { replace?: boolean; state?: unknown }
	) => void
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
	locationState: unknown
	navigationType: NavigationType
	getHref: (to: string) => string
	onNavigate: (callback: () => void) => () => void
	matchPath: (
		pattern: string,
		pathname?: string
	) => { params: Record<string, string> } | null
	generatePath: (pattern: string, params?: Record<string, string>) => string
}
