import jsonRules from './dottednames.json'
export type DottedName = keyof typeof jsonRules

export type Rule = {
	dottedName: DottedName
	question?: string
	unité: string
	unit: string
	name?: string
	title?: string
	defaultValue: any
	icons: string
	formule: any
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
