import { Temporal } from 'Engine/temporal.js'
import { Unit } from 'Engine/units'
import jsonRules from './dottednames.json'
export type DottedName = keyof typeof jsonRules

export type Rule = {
	dottedName: DottedName
	question?: string
	unité: string
	unit: string
	name?: string
	summary?: string
	title?: string
	defaultValue: any
	parentDependencies: Array<Rule>
	icons: string
	formule: any
}

// Pour l'instant, il y a trois valeurs possibles pour une évaluation :
// - `null` : L'évaluation n'est pas calculée car il manque des variables pour sa
//   valeur
// -  `false` : Le noeud n'est pas applicable, sa valeur n'est pas définie
// - <number> | <string> | <object> | <boolean> :  valeure du noeud
//
// Idée à creuser : une évaluation est un n-uple : (value, unit, missingVariable, isApplicable)
type BaseType = number | boolean | string | Object

export type Evaluation<T extends BaseType> = T | false | null

export type EvaluatedNode<T> = {
	unit: Unit
	nodeValue: Evaluation<T>
	temporalValue?: Temporal<Evaluation<T>>
	explanation?: Object
	missingVariables?: Object
	isDefault?: boolean
}

// This type should be defined inline by the function evaluating the rule (and
// probably infered as its return type). This is only a partial definition but
// it type-checks.
export type EvaluatedRule<T> = Rule &
	EvaluatedNode<T> & {
		isApplicable: boolean
		formule: EvaluatedNode<T>
	}
