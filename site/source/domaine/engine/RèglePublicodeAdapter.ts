import { isBoolean } from 'effect/Predicate'
import { DottedName } from 'modele-social'

import { SimpleRuleEvaluation } from '@/domaine/engine/SimpleRuleEvaluation'
import { toOuiNon } from '@/domaine/engine/toOuiNon'

export const RèglePublicodeAdapter = {
	decode: (
		règle: DottedName,
		brute: SimpleRuleEvaluation
	): SimpleRuleEvaluation => {
		if (isBoolean(brute)) {
			return brute
		}
		if (brute === null || brute === undefined) {
			return brute
		}

		return `'${brute}'`
	},
	encode: (règle: DottedName, valeur: SimpleRuleEvaluation) => {
		if (isBoolean(valeur)) {
			return toOuiNon(valeur)
		}

		return valeur
	},
}
