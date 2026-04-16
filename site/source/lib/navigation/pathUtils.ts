function stripTrailingSlash(path: string): string {
	return path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path
}

export function matchPath(
	pattern: string,
	pathname: string
): { params: Record<string, string> } | null {
	const normalizedPattern = stripTrailingSlash(pattern)
	const normalizedPath = stripTrailingSlash(pathname)

	if (normalizedPattern.endsWith('/*')) {
		const prefix = normalizedPattern.slice(0, -2)
		if (normalizedPath === prefix || normalizedPath.startsWith(prefix + '/')) {
			return {
				params: { '*': normalizedPath.slice(prefix.length + 1) },
			}
		}

		return null
	}

	const patternParts = normalizedPattern.split('/')
	const pathParts = normalizedPath.split('/')

	if (patternParts.length !== pathParts.length) {
		return null
	}

	const params: Record<string, string> = {}

	for (let i = 0; i < patternParts.length; i++) {
		if (patternParts[i].startsWith(':')) {
			params[patternParts[i].slice(1)] = pathParts[i]
		} else if (patternParts[i] !== pathParts[i]) {
			return null
		}
	}

	return { params }
}

export function generatePath(
	pattern: string,
	params?: Record<string, string>
): string {
	if (!params) {
		return pattern
	}

	return pattern.replace(/:([^/]+)/g, (_, key) => params[key] ?? '')
}
