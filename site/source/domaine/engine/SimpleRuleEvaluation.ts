import { PublicodesExpression } from 'publicodes'

export type SimplePublicodesExpression =
	| (PublicodesExpression & (string | number))
	| undefined

// export type SimpleRuleEvaluation = SimplePublicodesExpression | undefined | null
