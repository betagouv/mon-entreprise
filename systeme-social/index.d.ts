// Currenty we systematically bundle all the rules even if we only need a
// sub-section of them. We might support "code-splitting" the rules in the
// future.
import {
	EvaluatedRule as GenericEvaluatedRule,
	ParsedRule as GenericParsedRule,
	ParsedRules as GenericParsedRules,
	Rules as GenericRules
} from 'publicodes'
import { Names } from './dist/names'

export type DottedName = Names
export type Rules = GenericRules<Names>
export type ParsedRules = GenericParsedRules<Names>
export type ParsedRule = GenericParsedRule<Names>
export type EvaluatedRule = GenericEvaluatedRule<Names>
export type Situation = Partial<Record<Names, string>>
declare let rules: Rules
export default rules
