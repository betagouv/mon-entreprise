import R from 'ramda'
import rules from './load-rules'
import removeDiacritics from './remove-diacritics'
import {findRuleByName, extractRuleTypeAndName} from './rules'
import {recognizeExpression} from './recognizeExpression'


// L'objectif de la simulation : quelles règles voulons nous calculer ?
let selectedRules = rules.filter(rule =>
			R.contains(
				extractRuleTypeAndName(rule).name,
				['CIF CDD', 'Indemnité de fin de contrat']
			)
		)


let knownVariable = (situation, variableName) => (typeof situation(variableName) !== 'undefined')

let deriveRule = situation => R.pipe(
	R.toPairs,
	// Reduce to [variables needed to compute that variable, computed variable value]
	R.reduce(([variableNames, result], [key, value]) => {
		if (key === 'concerne') {
			let [variableName, evaluation] = recognizeExpression(value)
			// Si cette variable a été renseignée
			if (knownVariable(situation, variableName)) {
				// Si l'expression n'est pas vraie...
				if (!evaluation(situation)) {
					// On court-circuite toute la variable, et on n'a besoin d'aucune information !
					return R.reduced([[]])
				} else {
					// Sinon, on continue
					return [variableNames]
				}
			// sinon on demande la valeur de cette variable
			} else return [[...variableNames, variableName]]
		}

		if (key === 'non applicable si') {
			let conditions = value['l\'une de ces conditions']
			let [subVariableNames, reduced] = R.reduce(([variableNames], expression) => {
				let [variableName, evaluation] = recognizeExpression(expression)

				if (knownVariable(situation, variableName)) {
					if (evaluation(situation)) {
						return R.reduced([[], true])
					} else {
						return [variableNames]
					}
				}
				return [[...variableNames, variableName]]
			}, [[], null])(conditions)
			if (reduced) return R.reduced([[]])
			else return [variableNames.concat(subVariableNames)]
		}

		if (key === 'formule') {
			if (value['linéaire']) {
				let {assiette, taux} = value['linéaire']

				// A propos de l'assiette
				let assietteVariableName = removeDiacritics(assiette),
					assietteValue = situation(assietteVariableName),
					unknownAssiette = assietteValue == undefined

				if (unknownAssiette) {
					return [[...variableNames, assietteVariableName]]
				} else {
					if (variableNames.length > 0) {
						return [variableNames]
					}
				}

				// Arrivés là, cette formule devrait être calculable !

				// A propos du taux
				if (typeof taux !== 'string' && typeof taux !== 'number') {
					throw 'Oups, pas de taux compliqués s\'il-vous-plaît'
				}
				let tauxValue = taux.indexOf('%') > -1 ?
					+taux.replace('%', '') / 100 :
					+taux

				return R.reduced([null, assietteValue * tauxValue])
			}
		}

		return [variableNames]
	}, [[], null])
	)

let analyseRule = situation =>
	R.pipe(
		extractRuleTypeAndName, // -> {type, name, rule}
		data => R.assoc(
			'derived',
			deriveRule(situation)(data.rule)
		)(data)
	)


export let analyseSituation = situation =>
	R.pipe(
		R.map(analyseRule(situation))
	)(selectedRules)

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
