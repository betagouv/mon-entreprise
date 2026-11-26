export type RouteHrefs = Record<string, string>

const ignore = (reason: string): RouteHrefs => {
	// eslint-disable-next-line no-console
	console.warn(`ROUTE_HREFS ignorée : ${reason}`)

	return {}
}

const isRouteHrefs = (value: unknown): value is RouteHrefs =>
	typeof value === 'object' &&
	value !== null &&
	!Array.isArray(value) &&
	Object.values(value as Record<string, unknown>).every(
		(href) => typeof href === 'string'
	)

export const parseRouteHrefs = (serialized: string | undefined): RouteHrefs => {
	if (!serialized) {
		return {}
	}

	let parsed: unknown

	try {
		parsed = JSON.parse(serialized)
	} catch {
		return ignore('JSON invalide')
	}

	return isRouteHrefs(parsed)
		? parsed
		: ignore('ce n’est pas une table de liens par chemin')
}
