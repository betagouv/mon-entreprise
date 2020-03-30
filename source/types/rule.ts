import { Unit } from 'Engine/units'
import jsonRules from './dottednames.json'
export type DottedName = keyof typeof jsonRules

// TODO : différencier Rule et ParsedRule
export type Rules = { [key in DottedName]: Rule }

export type Rule = {
	dottedName: DottedName
	question?: string
	unité: string
	unit: Unit
	name?: string
	summary?: string
	title?: string
	defaultValue: any
	defaultUnit: Unit
	type: string
	API: Object
	parentDependencies: Array<Rule>
	icons: string
	formule: any
	suggestions: Object
}

// This type should be defined inline by the function evaluating the rule (and
// probably infered as its return type). This is only a partial definition but
// it type-checks.
export type EvaluatedRule<Explanation = Rule> = Rule & {
	nodeValue?: number
	isDefault?: boolean
	isApplicable: boolean
	missingVariables: Array<DottedName>
	explanation: Explanation
}
