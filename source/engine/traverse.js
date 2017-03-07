import {rules, findRuleByName, parentName} from './rules'
import {recognizeExpression} from './expressions'
import R from 'ramda'
import knownMecanisms from './known-mecanisms.yaml'
import { Parser } from 'nearley'
import Grammar from './grammar.ne'

let nearley = new Parser(Grammar.ParserRules, Grammar.ParserStart)

/*
 Dans ce fichier, les règles YAML sont parsées.
 Elles expriment un langage orienté expression, les expressions étant
 - préfixes quand elles sont des 'mécanismes' (des mot-clefs représentant des calculs courants dans la loi)
 - infixes pour les feuilles : des tests d'égalité, d'inclusion, des comparaisons sur des variables ou tout simplement la  variable elle-même, ou une opération effectuée sur la variable

*/


// L'objectif de la simulation : quelles règles voulons nous calculer ?
let selectedRules = rules.filter(rule =>
			R.contains(rule.name,
				[
					// 'CIF CDD',
					// 'fin de contrat',
					// 'majoration chômage CDD',
					'Indemnité compensatrice congés payés simplifiée'
				]
			)
		)

let knownVariable = (situationGate, variableName) => R.or(
	situationGate(variableName),
	situationGate(parentName(variableName)) // pour 'usage', 'motif' ( le parent de 'usage') = 'usage'
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

	// TODO tout le code de parsing des expressions est à refaire avec un vrai parser -> AST
	if (R.is(String)(rawNode)) {// it's an expression
		let [variableName, evaluation] = recognizeExpression(rule, rawNode),
			known = knownVariable(situationGate, variableName),
			value = known ?
				evaluation(situationGate)
			: null

		return {
			expression: rawNode,
			nodeValue: value, // null, true or false
			category: 'expression',
			type: 'boolean',
			explanation: null,
			missingVariables: known ? [] : [variableName]
		}
	}

	//TODO C'est pas bien ça. Devrait être traité par le parser plus haut !
	if (R.is(Number)(rawNode)) {
		return {
			category: 'number',
			nodeValue: rawNode,
			type: 'numeric'
		}
	}

	if (!R.is(Object)(rawNode)) {
		console.log('This node : ', rawNode)
		throw ' should be string or object'
	}

	let mecanisms = R.intersection(R.keys(rawNode), knownMecanisms)
	if (mecanisms.length != 1) throw 'OUPS !'
	let k = R.head(mecanisms),
		v = rawNode[k]

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

	//TODO perf: declare this closure somewhere else ?
	let treatNumericalLogicRec =
		R.ifElse(
			R.is(String),
			rate => ({
				nodeValue: transformPercentage(rate),
				type: 'numeric',
				category: 'percentage',
				percentage: rate,
				explanation: null
			}),
			R.pipe(
				R.unless(
					v => R.is(Object)(v) && R.keys(v).length >= 1,
					() => {throw 'Le mécanisme "logique numérique" et ses sous-logiques doivent contenir au moins une proposition'}
				),
				R.toPairs,
				R.reduce( (memo, [condition, consequence]) => {
					let {nodeValue, explanation} = memo,
						[variableName, evaluation] = recognizeExpression(rule, condition),
						childNumericalLogic = treatNumericalLogicRec(consequence),
						known = knownVariable(situationGate, variableName),
						nextNodeValue = !known ?
						// Si la proposition n'est pas encore résolvable
							null
						// Si la proposition est résolvable
						:	evaluation(situationGate) ?
							// Si elle est vraie
								childNumericalLogic.nodeValue
							// Si elle est fausse
							: false

					return {...memo,
						nodeValue: nodeValue == null ?
							null
						: nodeValue !== false ?
								nodeValue // l'une des propositions renvoie déjà une valeur numérique donc différente de false
							: nextNodeValue,
						// condition: condition,
						explanation: [...explanation, {
							nodeValue: nextNodeValue,
							category: 'condition',
							condition,
							conditionValue: evaluation(situationGate),
							type: 'boolean',
							explanation: childNumericalLogic
						}],
						missingVariables: known ? [] : [variableName]
					}
				}, {
					nodeValue: false,
					category: 'mecanism',
					name: "logique numérique",
					type: 'boolean || numeric', // lol !
					explanation: []
				})
		))

	if (k === 'logique numérique') {
		return treatNumericalLogicRec(v)
	}

	if (k === 'taux') {
		// debugger
		//TODO gérer les taux historisés
		if (R.is(String)(v))
			return {
				type: 'numeric',
				category: 'percentage',
				percentage: v,
				nodeValue: transformPercentage(v),
				explanation: null
			}
		else {
			let node = treat(situationGate, rule)(v)
			return {
				type: 'numeric',
				category: 'percentage',
				percentage: node.nodeValue,
				nodeValue: node.nodeValue,
				explanation: node
			}
		}
	}

	if (k === 'multiplication') {
		let base = v['assiette'],
			parsed = nearley.feed(base),
			yaya = console.log('parsed', parsed),
			[baseVariableName] = recognizeExpression(rule, base),
			baseValue = situationGate(baseVariableName),
			rateNode = treat(situationGate, rule)({taux: v['taux']}),
			rate = rateNode.nodeValue

		return {
			nodeValue: ((baseValue && rate) || null) && +baseValue * rate, // null * 6 = 0 :-o
			category: 'mecanism',
			name: 'multiplication',
			type: 'numeric',
			explanation: {
				base: {
					type: 'numeric',
					category: 'variable',
					// name: 'base', déduit de la propriété de l'objet
					nodeValue: baseValue == null ? null : +baseValue,
					explanation: null,
					variableName: baseVariableName,
					missingVariables: baseValue == null ? [baseVariableName] : []
				},
				rate: rateNode,
				// prorata:
				//TODO limit: 'plafond'
				//TODO multiplier: 'multiplicateur'
			}
		}
	}

	if (k === 'le maximum de') {
		let contenders = v.map(treat(situationGate, rule)),
			contenderValues = R.pluck('nodeValue')(contenders),
			stopEverything = R.contains(null, contenderValues),
			maxValue = R.max(...contenderValues)

		return {
			type: 'numeric',
			category: 'mecanism',
			name: 'le maximum de',
			nodeValue: stopEverything ? null : maxValue,
			explanation: contenders
		}
	}

	console.log('rawNode', rawNode)
	throw "Le mécanisme qui vient d'être loggué est inconnu !"

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
			explanation: child,
			shortCircuit: R.pathEq(['non applicable si', 'nodeValue'], true)
		}
	}
	,
	// TODO les mécanismes de composantes et de variations utilisables un peu partout !

	// TODO 'temporal': information concernant les périodes : à définir !

	// TODO 'intéractions': certaines variables vont en modifier d'autres : ex. Fillon va réduire voir annuler (set 0) une liste de cotisations

	// ... ?

})(rule)


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
