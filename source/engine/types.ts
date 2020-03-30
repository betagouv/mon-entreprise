import { Unit } from './units'

type Contrôle = {
	si: string
	message: string
	niveau: 'avertissement' | 'information'
	solution?: {
		cible: string
		texte: string
	}
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
	suggestions?: { [description: string]: string | number }
	références?: { [source: string]: string }
	contrôles?: Array<Contrôle>
}
export type Rules<Names extends string = string> = Record<Names, Rule>

export type ParsedRule<Name extends string = string> = Rule & {
	dottedName: Name
	name: string
	title: string
	parentDependencies: Array<any>
	unit?: Unit
	summary?: string
	defaultValue?: any
	defaultUnit?: Unit
	examples?: any
	API?: Object
	icons?: string
	formule?: any
	suggestions?: Object
	evaluate?: Function
	explanation?: any
	isDisabledBy?: Array<any>
	replacedBy?: Array<any>
	category?: string
	rulePropType?: string
	jsx?: Function
}

export type ParsedRules<Names extends string = string> = {
	[name in Names]: ParsedRule<name>
}

// This type should be defined inline by the function evaluating the rule (and
// probably infered as its return type). This is only a partial definition but
// it type-checks.
export type EvaluatedRule<
	Names extends string = string,
	Explanation = ParsedRule<Names>
> = ParsedRule<Names> & {
	nodeValue?: number
	isDefault?: boolean
	isApplicable: boolean
	missingVariables: Array<Names>
	explanation: Explanation
}
