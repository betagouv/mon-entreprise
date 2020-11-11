import { Temporal } from '../temporal'

type BaseUnit = string

export type Unit = {
	numerators: Array<BaseUnit>
	denominators: Array<BaseUnit>
}

export type Rule = {
	formule?: string
	question?: string
	description?: string
	unité?: string
	acronyme?: string
	exemples?: any
	résumé?: string
	titre?: string
	type?: string
	note?: string
	suggestions?: { [description: string]: number }
	références?: { [source: string]: string }
}
export type Rules<Names extends string = string> = Record<Names, Rule>

export type ParsedRule<Name extends string = string> = Rule & {
	dottedName: Name
	name: string
	title: string
	nodeKind: string
	parentDependencies: Array<any>
	rawRule: Rule
	unit?: Unit
	summary?: string
	defaultValue?: any
	defaultUnit?: Unit
	examples?: any
	API?: string
	icons?: string
	formule?: any
	explanation?: any
	isDisabledBy: Array<any>
	dependencies: Set<Name>
	replacedBy: Array<{
		whiteListedNames: Array<Name>
		blackListedNames: Array<Name>
		referenceNode: ParsedRule<Name>
		replacementNode: ParsedRule<Name>
	}>
	rulePropType?: string
	jsx?: () => React.Component
	cotisation?: Partial<{
		'dû par': string
		branche: string
		destinataire: string
		responsable: string
	}>
	taxe?: {
		'dû par': string
	}
}

export type ParsedRules<Names extends string = string> = {
	[name in Names]: ParsedRule<name>
}

export type Types = number | boolean | string

// Idée : une évaluation est un n-uple : (value, unit, missingVariable, isApplicable)
// Une temporalEvaluation est une liste d'evaluation sur chaque période. : [(Evaluation, Period)]
export type Evaluation<T extends Types = Types> = T | false | null

export type EvaluatedNode<
	Names extends string = string,
	T extends Types = Types
> = {
	nodeValue: Evaluation<T>
	explanation: Record<string, any>
	isDefault?: boolean
	jsx: React.FunctionComponent<EvaluatedNode>
	category?: string
	dottedName: Names
	missingVariables: Partial<Record<Names, number>>
} & (T extends number
	? {
			unit: Unit
			temporalValue?: Temporal<Evaluation<number>>
	  } // eslint-disable-next-line @typescript-eslint/ban-types
	: {})

// This type should be defined inline by the function evaluating the rule (and
// probably infered as its return type). This is only a partial definition but
// it type-checks.
export type EvaluatedRule<
	Names extends string = string,
	Explanation = ParsedRule<Names>,
	Type extends Types = Types
> = ParsedRule<Names> &
	EvaluatedNode<Names, Type> & {
		isApplicable: boolean
		explanation: Explanation
		// eslint-disable-next-line @typescript-eslint/ban-types
		'rendu non applicable': EvaluatedRule<Names, {}, Type>
		'applicable si': EvaluatedNode<Names, Type>
		'non applicable si': EvaluatedNode<Names, Type>
	}
