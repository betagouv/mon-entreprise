/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item: unknown): item is Record<string, unknown> {
	return !!item && typeof item === 'object' && !Array.isArray(item)
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
export function mergeDeep(
	target: Record<string, unknown>,
	...sources: Record<string, unknown>[]
): Record<string, unknown> {
	if (!sources.length) {
		return target
	}
	const source = sources.shift()

	if (isObject(target) && isObject(source)) {
		for (const key in source) {
			if (isObject(source[key])) {
				if (!target[key]) {
					Object.assign(target, { [key]: {} })
				}
				mergeDeep(
					target[key] as Record<string, unknown>,
					source[key] as Record<string, unknown>
				)
			} else if (Array.isArray(target[key]) && Array.isArray(source[key])) {
				return (target[key] as unknown[]).map((el, i) =>
					mergeDeep(
						el as Record<string, unknown>,
						(source[key] as unknown[])[i] as Record<string, unknown>
					)
				) as unknown as Record<string, unknown>
			} else {
				Object.assign(target, { [key]: source[key] })
			}
		}
	}

	return mergeDeep(target, ...sources)
}
