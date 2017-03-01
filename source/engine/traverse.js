import {rules, findRuleByName, parentName} from './rules'
import {recognizeExpression} from './expressions'
import R from 'ramda'

// L'objectif de la simulation : quelles règles voulons nous calculer ?
let selectedRules = rules.filter(rule =>
			R.contains(rule.name,
				[
					'CIF CDD',
					// 'fin de contrat',
					// 'majoration chômage CDD'
				]
			)
		)

let knownVariable = (situation, variableName) => R.or(
	situation(variableName),
	situation(parentName(variableName)) // pour 'usage', 'motif' ( le parent de 'usage') = 'usage'
) != null

let transformPercentage = s =>
	R.contains('%')(s) ?
		+s.replace('%', '') / 100
	: +s


/*
-> Notre règle est naturellement un AST (car notation préfixe dans le YAML)
-> préliminaire : les expression infixes devront être parsées,
par exemple ainsi : https://github.com/Engelberg/instaparse#transforming-the-tree
-> Notre règle entière est un AST, qu'il faut maintenant traiter :


- faire le calcul (déterminer les valeurs de chaque noeud)
- trouver les branches complètes pour déterminer les autres branches courtcircuitées
	- ex. rule.formule est courtcircuitée si rule.non applicable est vrai
	- les feuilles de "l'une de ces conditions" sont courtcircuitées si l'une d'elle est vraie
	- les feuilles de "toutes ces conditions" sont courtcircuitées si l'une d'elle est fausse
	- ...
(- bonus : utiliser ces informations pour l'ordre de priorité des variables inconnues)

- si une branche est incomplète et qu'elle est de type numérique, déterminer les bornes si c'est possible.
	Ex. - pour une multiplication, si l'assiette est connue mais que l 'applicabilité est inconnue,
				les bornes seront [0, multiplication.value = assiette * taux]
			- si taux = effectif entreprise >= 20 ? 1% : 2% et que l'applicabilité est connue,
				bornes = [assiette * 1%, assiette * 2%]

- transformer l'arbre en JSX pour afficher le calcul *et son état en prenant en compte les variables renseignées et calculées* de façon sympathique dans un butineur Web tel que Mozilla Firefox.


- surement plein d'autres applications...

*/

let treat = (situationGate, rule) => rawNode => {


	if (R.is(String)(rawNode)) {// it's an expression
		let [variableName, evaluation] = recognizeExpression(rule, rawNode),
			value = knownVariable(situationGate, variableName) ?
				evaluation(situationGate)
			: null

		return {
			expression: rawNode,
			nodeValue: value, // null, true or false
			category: 'expression',
			type: 'boolean',
			explanation: null
		}
	}

	if (!R.is(Object)(rawNode)) throw 'node should be string or object'

	let pairs = R.toPairs(rawNode),
		[k, v] = R.head(pairs)
	if (pairs.length !== 1) throw 'OUPS !'

	if (k === "l'une de ces conditions") {
		return R.pipe(
			R.unless(R.is(Array), () => {throw 'should be array'}),
			R.reduce( (memo, next) => {
				let {nodeValue, explanation} = memo,
					child = treat(situationGate, rule)(next),
					{nodeValue: nextValue} = child
				return {...memo,
					// c'est un OU logique mais avec une préférence pour null sur false
					nodeValue: nodeValue || nextValue || (
						nodeValue == null ? null : nextValue
					),
					explanation: [...explanation, child]
				}
			}, {
				nodeValue: false,
				category: 'mecanism',
				name: "l'une de ces conditions",
				type: 'boolean',
				explanation: []
			}) // Reduce but don't use R.reduced to set the nodeValue : we need to treat all the nodes
		)(v)
	}
	if (k === 'toutes ces conditions') {
		return R.pipe(
			R.unless(R.is(Array), () => {throw 'should be array'}),
			R.reduce( (memo, next) => {
				let {nodeValue, explanation} = memo,
					child = treat(situationGate, rule)(next),
					{nodeValue: nextValue} = child
				return {...memo,
					// c'est un ET logique avec une possibilité de null
					nodeValue: ! nodeValue ? nodeValue : nextValue,
					explanation: [...explanation, child]
				}
			}, {
				nodeValue: true,
				category: 'mecanism',
				name: 'toutes ces conditions',
				type: 'boolean',
				explanation: []
			}) // Reduce but don't use R.reduced to set the nodeValue : we need to treat all the nodes
		)(v)
	}

	if (k === 'multiplication') {
		let base = v['assiette'],
			[baseVariableName] = recognizeExpression(rule, base),
			baseValue = situationGate(baseVariableName)
		let rawRate = v['taux'], //TODO gérer les taux historisés
			rate = transformPercentage(rawRate)

		return {
			nodeValue: baseValue && baseValue * rate, // null * 6 = 0 :-o
			category: 'mecanism',
			name: 'multiplication',
			type: 'numeric',
			explanation: {
				base: {
					type: 'numeric',
					category: 'variable',
					// name: 'base', déduit de la propriété de l'objet
					nodeValue: baseValue,
					explanation: null,
					variableName: baseVariableName
				},
				rate: {
					type: 'numeric',
					category: 'percentage',
					percentage: rawRate,
					nodeValue: rate,
					explanation: null
				},
				//TODO limit: 'plafond'
				//TODO multiplier: 'multiplicateur'
			}
		}
	}

	throw 'Mécanisme inconnu !' +  JSON.stringify(rawNode)

}

let treatRuleRoot = (situationGate, rule) => R.evolve({ // -> Voilà les attributs que peut comporter, pour l'instant, une Variable.

	// 'meta': pas de traitement pour l'instant

	// 'cond' : Conditions d'applicabilité de la règle
	'non applicable si': value => {
		let child = treat(situationGate, rule)(value)
		return {
			category: 'ruleProp',
			rulePropType: 'cond',
			name: 'non applicable si',
			type: 'boolean',
			nodeValue: child.nodeValue,
			explanation: child
		}
	}
	,
	// [n'importe quel mécanisme booléen] : expression booléenne (simple variable, négation, égalité, comparaison numérique, test d'inclusion court / long) || l'une de ces conditions || toutes ces conditions
	// 'applicable si': // pareil mais inversé !

	// note: pour certaines variables booléennes, ex. appartenance à régime Alsace-Moselle, la formule et le non applicable si se rejoignent
	// [n'importe quel mécanisme numérique] : multiplication || barème en taux marginaux || le maximum de || le minimum de || ...
	'formule': value => {
		let child = treat(situationGate, rule)(value)
		return {
			category: 'ruleProp',
			rulePropType: 'formula',
			name: 'formule',
			type: 'numeric',
			nodeValue: child.nodeValue,
			explanation: child
		}
	}
	,
	// TODO les mécanismes de composantes et de variations utilisables un peu partout !

	// TODO 'temporal': information concernant les périodes : à définir !

	// TODO 'intéractions': certaines variables vont en modifier d'autres : ex. Fillon va réduire voir annuler (set 0) une liste de cotisations

	// ... ?

})(rule)


let deriveRuleOld = (situationGate, rule) => pipe( // eslint-disable-line no-unused-vars
	toPairs,
	reduce(({missingVariables, computedValue}, [key, value]) => {
		if (key === 'concerne') {
			let [variableName, evaluation] = recognizeExpression(rule, value)
			// Si cette variable a été renseignée
			if (knownVariable(situationGate, variableName)) {
				// Si l'expression n'est pas vraie...
				if (!evaluation(situationGate)) {
					// On court-circuite toute la variable, et on n'a besoin d'aucune information !
					return reduced({missingVariables: []})
				} else {
					// Sinon, on continue
					return {missingVariables}
				}
			// sinon on demande la valeur de cette variable
			} else return { missingVariables: [...missingVariables, variableName] }
		}

		if (key === 'non applicable si') {
			let conditions = value['l\'une de ces conditions']
			let [subVariableNames, reduced] = reduce(([variableNames], expression) => {
				let [variableName, evaluation] = recognizeExpression(rule, expression)
				if (knownVariable(situationGate, variableName)) {
					if (evaluation(situationGate)) {
						return reduced([[], true])
					} else {
						return [variableNames]
					}
				}
				return [[...variableNames, variableName]]
			}, [[], null])(conditions)

			if (reduced) return reduced({missingVariables: []})
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
								return pipe(
									toPairs(),
									reduce(({missingVariables}, [expression, subLogic]) => {
										let [variableName, evaluation] = recognizeExpression(rule, expression)
										if (knownVariable(situationGate, variableName)) {
											if (evaluation(situationGate)) {
												return reduced(treatNumericalLogic(subLogic))
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

				return computedValue != null ? reduced(formulaResult) : formulaResult

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
	selectedRules.map(
		rule => treatRuleRoot(situationGate, rule)
	)


export let variableType = name => {
	if (name == null) return null

	let found = findRuleByName(name)

	// tellement peu de variables pour l'instant
	// que c'est très simpliste
	if (!found) return 'boolean'
	let {rule} = found
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
