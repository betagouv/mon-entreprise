import React from 'react'
import {rules, findRuleByDottedName, disambiguateRuleReference, findRuleByName} from './rules'
import {evaluateVariable} from './variables'
import R from 'ramda'
import knownMecanisms from './known-mecanisms.yaml'
import { Parser } from 'nearley'
import Grammar from './grammar.ne'
import {Node, Leaf} from './traverse-common-jsx'
import {mecanismOneOf,mecanismAllOf,mecanismNumericalLogic,mecanismSum,mecanismProduct,
		mecanismPercentage,mecanismScale,mecanismMax,mecanismError, mecanismComplement} from "./mecanisms"

let nearley = () => new Parser(Grammar.ParserRules, Grammar.ParserStart)

/*
 Dans ce fichier, les règles YAML sont parsées.
 Elles expriment un langage orienté expression, les expressions étant
 - préfixes quand elles sont des 'mécanismes' (des mot-clefs représentant des calculs courants dans la loi)
 - infixes pour les feuilles : des tests d'égalité, d'inclusion, des comparaisons sur des variables ou tout simplement la  variable elle-même, ou une opération effectuée sur la variable

*/


/*
-> Notre règle est naturellement un AST (car notation préfixe dans le YAML)
-> préliminaire : les expression infixes devront être parsées,
par exemple ainsi : https://github.com/Engelberg/instaparse#transforming-the-tree
-> Notre règle entière est un AST, qu'il faut maintenant traiter :


- faire le calcul (déterminer les valeurs de chaque noeud)
- trouver les branches complètes pour déterminer les autres branches courtcircuitées
	- ex. rule.formule est courtcircuitée si rule.non applicable est vrai
	- les feuilles de 'une de ces conditions' sont courtcircuitées si l'une d'elle est vraie
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

// Creates a synthetic variable in the system namespace to signal filtering on components
let withFilter = (rules, filter) =>
	R.concat(rules,[{name:"filter", nodeValue:filter, ns:"sys", dottedName: "sys . filter"}])

let fillVariableNode = (rules, rule, situationGate) => (parseResult) => {
	let variableNode = createVariableNode(rules, rule, situationGate)(parseResult)
	return evaluateNode(situationGate,[],variableNode)
}

let createVariableNode = (rules, rule, situationGate) => (parseResult) => {
	let evaluate = (situation, parsedRules, node) => {
		let dottedName = node.dottedName,
			variable = findRuleByDottedName(rules, dottedName),
			variableIsCalculable = variable.formule != null,
			//TODO perf : mettre un cache sur les variables !
			// On le fait pas pour l'instant car ça peut compliquer les fonctionnalités futures
			// et qu'il n'y a aucun problème de perf aujourd'hui
			parsedRule = variableIsCalculable && evaluateNode(
				situationGate,
				[],
				treatRuleRoot(
					situationGate,
					rules,
					variable
				)
			),

			situationValue = evaluateVariable(situationGate, dottedName, variable),
			nodeValue2 = situationValue
					!= null ? situationValue
					: !variableIsCalculable
						? null
						: parsedRule.nodeValue,
			nodeValue = dottedName.startsWith("sys .") ? variable.nodeValue : nodeValue2,
			explanation = parsedRule,
			missingVariables = variableIsCalculable ? [] : (nodeValue == null ? [dottedName] : [])

			return {
				...node,
				nodeValue,
				missingVariables,
				explanation,
				jsx: {
					...node.jsx,
					value: nodeValue
				}
			}
	}

	let
		{fragments} = parseResult,
		variablePartialName = fragments.join(' . '),
		dottedName = disambiguateRuleReference(rules, rule, variablePartialName)

	return {
		evaluate,
		category: 'variable',
		fragments: fragments,
		dottedName,
		type: 'boolean | numeric',
		jsx:	<Leaf
			classes="variable"
			name={fragments.join(' . ')}
		/>
	}
}


let buildNegatedVariable = variable => {
	let nodeValue = variable.nodeValue == null ? null : !variable.nodeValue
	return {
		nodeValue,
		category: 'mecanism',
		name: 'négation',
		type: 'boolean',
		explanation: variable,
		jsx:	<Node
			classes="inlineExpression negation"
			value={nodeValue}
			child={
				<span className="nodeContent">
					<span className="operator">¬</span>
					{variable.jsx}
				</span>
			}
		/>
	}
}

let treat = (situationGate, rules, rule) => rawNode => {
	// inner functions
	let reTreat = treat(situationGate, rules, rule),
		treatString = rawNode => {
			/* On a à faire à un string, donc à une expression infixe.
			Elle sera traité avec le parser obtenu grâce à NearleyJs et notre grammaire.
			On obtient un objet de type Variable (avec potentiellement un 'modifier', par exemple temporel (TODO)), CalcExpression ou Comparison.
			Cet objet est alors rebalancé à 'treat'.
			*/

			let [parseResult, ...additionnalResults] = nearley().feed(rawNode).results

			if (additionnalResults && additionnalResults.length > 0)
				throw "Attention ! L'expression <" + rawNode + '> ne peut être traitée de façon univoque'

			if (!R.contains(parseResult.category)(['variable', 'calcExpression', 'filteredVariable', 'comparison', 'negatedVariable']))
				throw "Attention ! Erreur de traitement de l'expression : " + rawNode

			if (parseResult.category == 'variable')
				return fillVariableNode(rules, rule, situationGate)(parseResult)
			if (parseResult.category == 'filteredVariable') {
				let newRules = withFilter(rules,parseResult.filter)
				return fillVariableNode(newRules, rule, situationGate)(parseResult.variable)
			}
			if (parseResult.category == 'negatedVariable')
				return buildNegatedVariable(
					fillVariableNode(rules, rule, situationGate)(parseResult.variable)
				)

			if (parseResult.category == 'calcExpression') {
				let
					fillVariable = fillVariableNode(rules, rule, situationGate),
					fillFiltered = parseResult => fillVariableNode(withFilter(rules,parseResult.filter), rule, situationGate)(parseResult.variable),
					filledExplanation = parseResult.explanation.map(
						R.cond([
							[R.propEq('category', 'variable'), fillVariable],
							[R.propEq('category', 'filteredVariable'), fillFiltered],
							[R.propEq('category', 'value'), node =>
								R.assoc('jsx', <span className="value">
									{node.nodeValue}
								</span>)(node)
							]
						])
					),
					[{nodeValue: value1}, {nodeValue: value2}] = filledExplanation,
					operatorFunctionName = {
						'*': 'multiply',
						'/': 'divide',
						'+': 'add',
						'-': 'subtract'
					}[parseResult.operator],
					operatorFunction = R[operatorFunctionName],
					nodeValue = value1 == null || value2 == null ?
						null
					: operatorFunction(value1, value2)

				return {
					text: rawNode,
					nodeValue,
					category: 'calcExpression',
					type: 'numeric',
					explanation: filledExplanation,
					jsx:	<Node
						classes="inlineExpression calcExpression"
						value={nodeValue}
						child={
							<span className="nodeContent">
								{filledExplanation[0].jsx}
								<span className="operator">{parseResult.operator}</span>
								{filledExplanation[1].jsx}
							</span>
						}
					/>
				}
			}
			if (parseResult.category == 'comparison') {
				//TODO mutualise code for 'comparison' & 'calclExpression'. Harmonise their names
				let
					filledExplanation = parseResult.explanation.map(
						R.cond([
							[R.propEq('category', 'variable'), fillVariableNode(rules, rule, situationGate)],
							[R.propEq('category', 'value'), node =>
								R.assoc('jsx', <span className="value">
									{node.nodeValue}
								</span>)(node)
							]
						])
					),
					[{nodeValue: value1}, {nodeValue: value2}] = filledExplanation,
					comparatorFunctionName = {
						'<': 'lt',
						'<=': 'lte',
						'>': 'gt',
						'>=': 'gte'
						//TODO '='
					}[parseResult.operator],
					comparatorFunction = R[comparatorFunctionName],
					nodeValue = value1 == null || value2 == null ?
						null
					: comparatorFunction(value1, value2)

				return {
					text: rawNode,
					nodeValue: nodeValue,
					category: 'comparison',
					type: 'boolean',
					explanation: filledExplanation,
					jsx:	<Node
						classes="inlineExpression comparison"
						value={nodeValue}
						child={
							<span className="nodeContent">
								{filledExplanation[0].jsx}
								<span className="operator">{parseResult.operator}</span>
								{filledExplanation[1].jsx}
							</span>
						}
					/>
				}
			}
		},
		treatNumber = rawNode => {
			return {
				text: ""+rawNode,
				category: 'number',
				nodeValue: rawNode,
				type: 'numeric',
				jsx:
					<span className="number">
						{rawNode}
					</span>
			}
		},
		treatOther = rawNode => {
			console.log() // eslint-disable-line no-console
			throw 'Cette donnée : ' + rawNode + ' doit être un Number, String ou Object'
		},
		treatObject = rawNode => {
			let mecanisms = R.intersection(R.keys(rawNode), R.keys(knownMecanisms))

			if (mecanisms.length != 1) {
				console.log('Erreur : On ne devrait reconnaître que un et un seul mécanisme dans cet objet', rawNode)
				throw 'OUPS !'
			}

			let k = R.head(mecanisms),
				v = rawNode[k]

			let dispatch = {
					'une de ces conditions':	mecanismOneOf,
					'toutes ces conditions':	mecanismAllOf,
					'logique numérique':		mecanismNumericalLogic,
					'taux':						mecanismPercentage,
					'somme':					mecanismSum,
					'multiplication':			mecanismProduct,
					'barème':					mecanismScale,
					'le maximum de':			mecanismMax,
					'complément':				mecanismComplement,
					'une possibilité':			R.always({})
				},
				action = R.pathOr(mecanismError,[k],dispatch)

			return action(reTreat,k,v)
		}

	let onNodeType = R.cond([
		[R.is(String),	treatString],
		[R.is(Number),	treatNumber],
		[R.is(Object),	treatObject],
		[R.T,			treatOther]
	])
	return onNodeType(rawNode)
}

//TODO c'est moche :
export let computeRuleValue = (formuleValue, condValue) =>
	condValue === undefined
	? formuleValue
	: formuleValue === 0
	? 0
	: condValue === null
		? null
		: condValue === true
			? 0
			: formuleValue

export let treatRuleRoot = (situationGate, rules, rule) => {
	let evaluate = (situationGate, parsedRules, r) => {
		let
			formuleValue = r.formule.nodeValue,
			condValue = R.path(['non applicable si', 'nodeValue'])(r),
			nodeValue = computeRuleValue(formuleValue, condValue)

		return {...r, nodeValue}
	}

	let parsedRoot = R.evolve({ // -> Voilà les attributs que peut comporter, pour l'instant, une Variable.

	// 'meta': pas de traitement pour l'instant

	// 'cond' : Conditions d'applicabilité de la règle
		'non applicable si': value => {
			let
				child = treat(situationGate, rules, rule)(value),
				nodeValue = child.nodeValue

			return {
				category: 'ruleProp',
				rulePropType: 'cond',
				name: 'non applicable si',
				type: 'boolean',
				nodeValue: child.nodeValue,
				explanation: child,
				jsx: <Node
					classes="ruleProp mecanism cond"
					name="non applicable si"
					value={nodeValue}
					child={
						child.category === 'variable' ? <div className="node">{child.jsx}</div>
						: child.jsx
					}
				/>
			}
		}
		,
		// [n'importe quel mécanisme booléen] : expression booléenne (simple variable, négation, égalité, comparaison numérique, test d'inclusion court / long) || l'une de ces conditions || toutes ces conditions
		// 'applicable si': // pareil mais inversé !

		// note: pour certaines variables booléennes, ex. appartenance à régime Alsace-Moselle, la formule et le non applicable si se rejoignent
		// [n'importe quel mécanisme numérique] : multiplication || barème en taux marginaux || le maximum de || le minimum de || ...
		'formule': value => {
			let
				child = treat(situationGate, rules, rule)(value),
				nodeValue = child.nodeValue
			return {
				category: 'ruleProp',
				rulePropType: 'formula',
				name: 'formule',
				type: 'numeric',
				nodeValue: nodeValue,
				explanation: child,
				shortCircuit: R.pathEq(['non applicable si', 'nodeValue'], true),
				jsx: <Node
					classes="ruleProp mecanism formula"
					name="formule"
					value={nodeValue}
					child={
						child.jsx
					}
				/>
			}
		}
	,
	// TODO les mécanismes de composantes et de variations utilisables un peu partout !
	// TODO 'temporal': information concernant les périodes : à définir !
	// TODO 'intéractions': certaines variables vont en modifier d'autres : ex. Fillon va réduire voir annuler (set 0) une liste de cotisations
	// ... ?

	})(rule)

	return {
		...parsedRoot,
		evaluate
	}
}

let evaluateNode = (situationGate, parsedRules, node) => node.evaluate(situationGate, parsedRules, node)

/* Analyse the set of selected rules, and add derived information to them :
- do they need variables that are not present in the user situation ?
- if not, do they have a computed value or are they non applicable ?
*/

export let analyseSituation = (rules, rootVariable) => situationGate => {
	let treatOne = rule => treatRuleRoot(situationGate, rules, rule),
		parsedRules = R.map(treatOne,rules),
		rootRule = findRuleByName(parsedRules, rootVariable)

	return evaluateNode(situationGate, parsedRules, rootRule)
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
	une de ces conditions: ([expression | boolean logic])
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
