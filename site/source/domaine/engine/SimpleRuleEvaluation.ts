import { PublicodesExpression } from 'publicodes'

export type SimpleRuleEvaluation =
	| (PublicodesExpression & (string | boolean | number))
	| undefined
