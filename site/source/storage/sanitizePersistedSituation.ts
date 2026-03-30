import { PublicodesExpression } from 'publicodes'

import { isExpressionAvecUnité } from '@/domaine/ExpressionPublicodes'

export const sanitizePersistedSituation = (
	situation: Record<string, PublicodesExpression | undefined>
): Record<string, PublicodesExpression> => {
	const sanitized: Record<string, PublicodesExpression> = {}

	for (const [key, value] of Object.entries(situation)) {
		if (typeof value === 'string' || typeof value === 'number') {
			sanitized[key] = value
		} else if (isExpressionAvecUnité(value)) {
			sanitized[key] = `${value.valeur} ${value.unité}`
		}
	}

	return sanitized
}
