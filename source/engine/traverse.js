import R from 'ramda'
import {rules, findRuleByName, parentName} from './rules'
import {recognizeExpression} from './expressions'


// L'objectif de la simulation : quelles règles voulons nous calculer ?
let selectedRules = rules.filter(rule =>
			R.contains(rule.name,
				[
					'CIF CDD',
					'fin de contrat',
					'majoration chômage CDD'
				]
			)
		)

let knownVariable = (situation, variableName) => R.or(
	situation(variableName),
	situation(parentName(variableName)) // pour 'usage', 'motif' ( le parent de 'usage') = 'usage'
) != null

let transformPercentage = s =>
	s.indexOf('%') > -1 ?
		+s.replace('%', '') / 100 :
		+s



let deriveRule = (situationGate, rule) => R.pipe(
	R.toPairs,
	R.reduce(({missingVariables, computedValue}, [key, value]) => {
		if (key === 'concerne') {
			let [variableName, evaluation] = recognizeExpression(rule, value)
			// Si cette variable a été renseignée
			if (knownVariable(situationGate, variableName)) {
				// Si l'expression n'est pas vraie...
				if (!evaluation(situationGate)) {
					// On court-circuite toute la variable, et on n'a besoin d'aucune information !
					return R.reduced({missingVariables: []})
				} else {
					// Sinon, on continue
					return {missingVariables}
				}
			// sinon on demande la valeur de cette variable
			} else return { missingVariables: [...missingVariables, variableName] }
		}

		if (key === 'non applicable si') {
			let conditions = value['l\'une de ces conditions']
			let [subVariableNames, reduced] = R.reduce(([variableNames], expression) => {
				let [variableName, evaluation] = recognizeExpression(rule, expression)
				if (knownVariable(situationGate, variableName)) {
					if (evaluation(situationGate)) {
						return R.reduced([[], true])
					} else {
						return [variableNames]
					}
				}
				return [[...variableNames, variableName]]
			}, [[], null])(conditions)

			if (reduced) return R.reduced({missingVariables: []})
			else return {missingVariables: [...missingVariables, ...subVariableNames]}
		}

		if (key === 'formule') {
			if (value['multiplication']) {
				let {assiette, taux} = value['multiplication']

				// A propos de l'assiette
				let [assietteVariableName] = recognizeExpression(rule, assiette),
					assietteValue = situationGate(assietteVariableName),
					unknownAssiette = assietteValue == undefined

				// Arrivés là, cette formule devrait être calculable !
				let {missingVariables: tauxMissingVariables = [], computedValue} = typeof taux !== 'string' ?
					do {
						let numericalLogic = taux['logique numérique']
						if (!numericalLogic) throw 'On ne sait pas pour l\'instant traiter ce mécanisme de taux'

						let treatNumericalLogic = numericalLogic => {
							if (typeof numericalLogic == 'string') {
								return new Object({computedValue: assietteValue * transformPercentage(numericalLogic)})
							} else {
								return R.pipe(
									R.toPairs(),
									R.reduce(({missingVariables}, [expression, subLogic]) => {
										let [variableName, evaluation] = recognizeExpression(rule, expression)
										if (knownVariable(situationGate, variableName)) {
											if (evaluation(situationGate)) {
												return R.reduced(treatNumericalLogic(subLogic))
											} else {
												return {missingVariables}
											}
										} else return {missingVariables: [...missingVariables, variableName]}
									}, {missingVariables: []})
							)(numericalLogic)
							}}
						treatNumericalLogic(numericalLogic)
					} : ({computedValue: assietteValue * transformPercentage(taux)})

				let formulaResult = {
					missingVariables: [
						...missingVariables,
						...(unknownAssiette ? [assietteVariableName] : []),
						...tauxMissingVariables
					],
					computedValue
				}

				return computedValue != null ? R.reduced(formulaResult) : formulaResult

			}
		}

		return {missingVariables}
	}, {missingVariables: []}
	)
)


/* Analyse the set of selected rules, and add derived information to them :
- do they need variables that are not present in the user situation ?
- if not, do they have a computed value or are they non applicable ?
*/
export let analyseSituation = situationGate =>
	selectedRules.map(rule =>
		// how to express that better in Ramda ?
		R.assoc(
			'derived',
			deriveRule(situationGate, rule)(rule)
		)(rule)
	)


export let variableType = name => {
	if (name == null) return null

	let found = findRuleByName(name)

	// tellement peu de variables pour l'instant
	// que c'est très simpliste
	if (!found) return 'boolean'
	let {rule, type} = found
	if (typeof rule.formule['somme'] !== 'undefined') return 'numeric'
}







/*--------------------------------------------------------------------------------
 Ce qui suit est la première tentative d'écriture du principe du moteur et de la syntaxe */

// let types = {
	/*
	(expression):
		| (variable)
		| (négation)
		| (égalité)
		| (comparaison numérique)
		| (test d'inclusion court)
	*/

// }

// let root = {
// 	Variable: {
// 		'concerne': types['expression'],
// 		'ne concerne pas': types['expression']
// 		// 'applicable si': types['boolean logic'],
// 		// 'non applicable si': types['boolean logic']
// 	}
// }

/*
Variable:
	- applicable si: (boolean logic)
	- non applicable si: (boolean logic)
	- concerne: (expression)
	- ne concerne pas: (expression)

(boolean logic):
	toutes ces conditions: ([expression | boolean logic])
	l'une de ces conditions: ([expression | boolean logic])
	conditions exclusives: ([expression | boolean logic])

"If you write a regular expression, walk away for a cup of coffee, come back, and can't easily understand what you just wrote, then you should look for a clearer way to express what you're doing."

Les expressions sont le seul mécanisme relativement embêtant pour le moteur. Dans un premier temps, il les gerera au moyen d'expressions régulières, puis il faudra probablement mieux s'équiper avec un "javascript parser generator" :
https://medium.com/@daffl/beyond-regex-writing-a-parser-in-javascript-8c9ed10576a6

(variable): (string)

(négation):
	! (variable)

(égalité):
	(variable) = (variable.type)

(comparaison numérique):
	| (variable) < (variable.type)
	| (variable) <= (variable.type)
	| (variable) > (variable.type)
	| (variable) <= (variable.type)

(test d'inclusion court):
	(variable) ⊂ [variable.type]

in Variable.formule :
	- composantes
	- linéaire
	- barème en taux marginaux
	- test d'inclusion: (test d'inclusion)

(test d'inclusion):
	variable: (variable)
	possibilités: [variable.type]

# pas nécessaire pour le CDD

	in Variable
		- variations: [si]

	(si):
		si: (expression)
		# corps

	*/
