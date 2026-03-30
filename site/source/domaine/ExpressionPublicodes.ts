export const isExpressionAvecUnité = (
	value: unknown
): value is { valeur: number; unité: string } => {
	if (typeof value !== 'object' || value === null) return false
	const v = value as Record<string, unknown>

	return typeof v.valeur === 'number' && typeof v.unité === 'string'
}
