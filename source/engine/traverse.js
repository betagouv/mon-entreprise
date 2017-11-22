import React from 'react'
import {
	findRuleByDottedName,
	disambiguateRuleReference,
	findRuleByName
} from './rules'
import { evaluateVariable } from './variables'
import R from 'ramda'
import knownMecanisms from './known-mecanisms.yaml'
import { Parser } from 'nearley'
import Grammar from './grammar.ne'
import { Node, Leaf } from './mecanismViews/common'
import {
	mecanismOneOf,
	mecanismAllOf,
	mecanismNumericalSwitch,
	mecanismSum,
	mecanismProduct,
	mecanismScale,
	mecanismMax,
	mecanismMin,
	mecanismError,
	mecanismComplement,
	mecanismSelection,
	mecanismInversion
} from './mecanisms'
import {
	evaluateNode,
	rewriteNode,
	collectNodeMissing,
	makeJsx
} from './evaluation'
import {
	anyNull,
	val,
	undefOrTrue,
	applyOrEmpty
} from './traverse-common-functions'


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

let fillFilteredVariableNode = (rules, rule) => (filter, parseResult) => {
	let evaluateFiltered = originalEval => (situation, parsedRules, node) => {
		let newSituation = name => (name == 'sys.filter' ? filter : situation(name))
		return originalEval(newSituation, parsedRules, node)
	}
	let node = fillVariableNode(rules, rule)(parseResult)
	return {
		...node,
		evaluate: evaluateFiltered(node.evaluate)
	}
}

// TODO: dirty, dirty
// ne pas laisser trop longtemps cette "optimisation" qui tue l'aspect fonctionnel de l'algo
var dict

export let clearDict = () => (dict = {})

let fillVariableNode = (rules, rule) => parseResult => {
	let evaluate = (situation, parsedRules, node) => {
		let dottedName = node.dottedName,
			// On va vérifier dans le cache courant, dict, si la variable n'a pas été déjà évaluée
			// En effet, l'évaluation dans le cas d'une variable qui a une formule, est coûteuse !
			filter = situation('sys.filter'),
			cacheName = dottedName + (filter ? '.' + filter : ''),
			cached = dict[cacheName],
			// make parsedRules a dict object, that also serves as a cache of evaluation ?
			variable = cached
				? cached
				: findRuleByDottedName(parsedRules, dottedName),
			variableIsCalculable = variable.formule != null,
			parsedRule =
				variableIsCalculable &&
				(cached ? cached : evaluateNode(situation, parsedRules, variable)),
			// evaluateVariable renvoit la valeur déduite de la situation courante renseignée par l'utilisateur
			situationValue = evaluateVariable(situation, dottedName, variable),
			nodeValue =
				situationValue != null
					? situationValue // cette variable a été directement renseignée
					: variableIsCalculable
						? parsedRule.nodeValue // la valeur du calcul fait foi
						: null, // elle restera donc nulle
			explanation = parsedRule,
			missingVariables = variableIsCalculable ? [] : [dottedName]

		let collectMissing = node =>
			nodeValue != null // notamment si situationValue != null
				? []
				: variableIsCalculable
					? collectNodeMissing(parsedRule)
					: node.missingVariables

		let result = cached
			? cached
			: {
				...rewriteNode(node, nodeValue, explanation, collectMissing),
				missingVariables
			}
		dict[cacheName] = result

		return result
	}

	let { fragments } = parseResult,
		variablePartialName = fragments.join(' . '),
		dottedName = disambiguateRuleReference(rules, rule, variablePartialName)

	let jsx = nodeValue => (
		<Leaf classes="variable" name={fragments.join(' . ')} value={nodeValue} />
	)

	return {
		evaluate,
		jsx,
		name: variablePartialName,
		category: 'variable',
		fragments,
		dottedName,
		type: 'boolean | numeric'
	}
}

let buildNegatedVariable = variable => {
	let evaluate = (situation, parsedRules, node) => {
		let explanation = evaluateNode(situation, parsedRules, node.explanation),
			nodeValue = explanation.nodeValue == null ? null : !explanation.nodeValue
		let collectMissing = node => collectNodeMissing(node.explanation)
		return rewriteNode(node, nodeValue, explanation, collectMissing)
	}

	let jsx = (nodeValue, explanation) => (
		<Node
			classes="inlineExpression negation"
			value={nodeValue}
			child={
				<span className="nodeContent">
					<span className="operator">¬</span>
					{makeJsx(explanation)}
				</span>
			}
		/>
	)

	return {
		evaluate,
		jsx,
		category: 'mecanism',
		name: 'négation',
		type: 'boolean',
		explanation: variable
	}
}

let treat = (rules, rule) => rawNode => {
	// inner functions
	let reTreat = treat(rules, rule),
		treatString = rawNode => {
			/* On a affaire à un string, donc à une expression infixe.
			Elle sera traité avec le parser obtenu grâce à NearleyJs et notre grammaire `grammar.ne`.
			On obtient un objet de type Variable (avec potentiellement un 'modifier', par exemple temporel (TODO)), CalcExpression ou Comparison.
			Cet objet est alors rebalancé à 'treat'.
			*/

			let [parseResult, ...additionnalResults] = nearley().feed(rawNode).results

			if (additionnalResults && additionnalResults.length > 0)
				throw 'Attention ! L\'expression <' +
					rawNode +
					'> ne peut être traitée de façon univoque'

			if (
				!R.contains(parseResult.category)([
					'variable',
					'calcExpression',
					'filteredVariable',
					'comparison',
					'negatedVariable',
					'percentage'
				])
			)
				throw 'Attention ! Erreur de traitement de l\'expression : ' + rawNode

			if (parseResult.category == 'variable')
				return fillVariableNode(rules, rule)(parseResult)
			if (parseResult.category == 'filteredVariable') {
				return fillFilteredVariableNode(rules, rule)(
					parseResult.filter,
					parseResult.variable
				)
			}
			if (parseResult.category == 'negatedVariable')
				return buildNegatedVariable(
					fillVariableNode(rules, rule)(parseResult.variable)
				)

			// We don't need to handle category == 'value' because YAML then returns it as
			// numerical value, not a String: it goes to treatNumber
			if (parseResult.category == 'percentage') {
				return {
					nodeValue: parseResult.nodeValue,
					jsx: () => <span className="percentage">{rawNode}</span>
				}
			}

			if (
				parseResult.category == 'calcExpression' ||
				parseResult.category == 'comparison'
			) {
				let evaluate = (situation, parsedRules, node) => {
					let operatorFunctionName = {
							'*': 'multiply',
							'/': 'divide',
							'+': 'add',
							'-': 'subtract',
							'<': 'lt',
							'<=': 'lte',
							'>': 'gt',
							'>=': 'gte',
							'=': 'equals',
							'!=': 'equals'
						}[node.operator],
						explanation = R.map(
							R.curry(evaluateNode)(situation, parsedRules),
							node.explanation
						),
						value1 = explanation[0].nodeValue,
						value2 = explanation[1].nodeValue,
						operatorFunction =
							node.operator == '!='
								? (a, b) => !R.equals(a, b)
								: R[operatorFunctionName],
						nodeValue =
							value1 == null || value2 == null
								? null
								: operatorFunction(value1, value2)

					let collectMissing = node =>
						R.chain(collectNodeMissing, node.explanation)

					return rewriteNode(node, nodeValue, explanation, collectMissing)
				}

				let fillFiltered = parseResult =>
					fillFilteredVariableNode(rules, rule)(
						parseResult.filter,
						parseResult.variable
					)
				let fillVariable = fillVariableNode(rules, rule),
					filledExplanation = parseResult.explanation.map(
						R.cond([
							[R.propEq('category', 'variable'), fillVariable],
							[R.propEq('category', 'filteredVariable'), fillFiltered],
							[
								R.propEq('category', 'value'),
								node => ({
									nodeValue: node.nodeValue,
									jsx: nodeValue => <span className="value">{nodeValue}</span>
								})
							],
							[
								R.propEq('category', 'percentage'),
								node => ({
									nodeValue: node.nodeValue,
									jsx: nodeValue => (
										<span className="value">{nodeValue * 100}%</span>
									)
								})
							]
						])
					),
					operator = parseResult.operator

				let jsx = (nodeValue, explanation) => (
					<Node
						classes={'inlineExpression ' + parseResult.category}
						value={nodeValue}
						child={
							<span className="nodeContent">
								{makeJsx(explanation[0])}
								<span className="operator">{parseResult.operator}</span>
								{makeJsx(explanation[1])}
							</span>
						}
					/>
				)

				return {
					evaluate,
					jsx,
					operator,
					text: rawNode,
					category: parseResult.category,
					type:
						parseResult.category == 'calcExpression' ? 'numeric' : 'boolean',
					explanation: filledExplanation
				}
			}
		},
		treatNumber = rawNode => {
			return {
				text: '' + rawNode,
				category: 'number',
				nodeValue: rawNode,
				type: 'numeric',
				jsx: <span className="number">{rawNode}</span>
			}
		},
		treatOther = rawNode => {
			console.log() // eslint-disable-line no-console
			throw 'Cette donnée : ' +
				rawNode +
				' doit être un Number, String ou Object'
		},
		treatObject = rawNode => {
			let mecanisms = R.intersection(R.keys(rawNode), R.keys(knownMecanisms))

			if (mecanisms.length != 1) {
				console.log(
					// eslint-disable-line no-console
					'Erreur : On ne devrait reconnaître que un et un seul mécanisme dans cet objet',
					mecanisms,
					rawNode
				)
				throw 'OUPS !'
			}

			let k = R.head(mecanisms),
				v = rawNode[k]

			let dispatch = {
					'une de ces conditions': mecanismOneOf,
					'toutes ces conditions': mecanismAllOf,
					'aiguillage numérique': mecanismNumericalSwitch,
					somme: mecanismSum,
					multiplication: mecanismProduct,
					barème: mecanismScale,
					'le maximum de': mecanismMax,
					'le minimum de': mecanismMin,
					complément: mecanismComplement,
					sélection: mecanismSelection,
					'une possibilité': R.always({
						'une possibilité': 'oui',
						collectMissing: () => [rule.dottedName]
					}),
					'inversion': mecanismInversion(rule.dottedName)
				},
				action = R.propOr(mecanismError, k, dispatch)

			return action(reTreat, k, v)
		}

	let onNodeType = R.cond([
		[R.is(String), treatString],
		[R.is(Number), treatNumber],
		[R.is(Object), treatObject],
		[R.T, treatOther]
	])

	let defaultEvaluate = (situationGate, parsedRules, node) => node
	let parsedNode = onNodeType(rawNode)

	return parsedNode.evaluate
		? parsedNode
		: { ...parsedNode, evaluate: defaultEvaluate }
}

export let computeRuleValue = (formuleValue, isApplicable) =>
	isApplicable === true
		? formuleValue
		: isApplicable === false ? 0 : formuleValue == 0 ? 0 : null


export let treatRuleRoot = (rules, rule) => {
	let evaluate = (situationGate, parsedRules, r) => {

		let evolveRule = R.curry(evaluateNode)(situationGate, parsedRules),
			evaluated = R.evolve(
				{
					formule: evolveRule,
					'non applicable si': evolveRule,
					'applicable si': evolveRule
				},
				r
			),
			formuleValue = val(evaluated['formule']),
			isApplicable = do {
				let e = evaluated
				val(e['non applicable si']) === true
					? false
					: val(e['applicable si']) === false
						? false
						: anyNull([e['non applicable si'], e['applicable si']])
							? null
							: !val(e['non applicable si']) &&
								undefOrTrue(val(e['applicable si']))
			},
			nodeValue = computeRuleValue(formuleValue, isApplicable)

		return { ...evaluated, nodeValue, isApplicable }
	}

	let collectMissing = rule => {
		let {
			formule,
			isApplicable,
			'non applicable si': notApplicable,
			'applicable si': applicable
		} = rule

		let condMissing =
				val(notApplicable) === true
					? []
					: val(applicable) === false
						? []
						: [
							...applyOrEmpty(collectNodeMissing)(notApplicable),
							...applyOrEmpty(collectNodeMissing)(applicable)
						],
			collectInFormule = isApplicable !== false,
			formMissing = applyOrEmpty(() =>
				applyOrEmpty(collectNodeMissing)(formule)
			)(collectInFormule)

		return R.concat(condMissing, formMissing)
	}

	let parsedRoot = R.evolve({
		// Voilà les attributs d'une règle qui sont aujourd'hui dynamiques, donc à traiter
		// Les métadonnées d'une règle n'en font pas aujourd'hui partie

		// condition d'applicabilité de la règle
		'non applicable si': evolveCond('non applicable si', rule, rules),
		'applicable si': evolveCond('applicable si', rule, rules),
		formule: value => {
			let evaluate = (situationGate, parsedRules, node) => {
				let collectMissing = node => collectNodeMissing(node.explanation)
				let explanation = evaluateNode(
						situationGate,
						parsedRules,
						node.explanation
					),
					nodeValue = explanation.nodeValue
				return rewriteNode(node, nodeValue, explanation, collectMissing)
			}

			let child = treat(rules, rule)(value)

			let jsx = (nodeValue, explanation) => makeJsx(explanation)

			return {
				evaluate,
				jsx,
				category: 'ruleProp',
				rulePropType: 'formula',
				name: 'formule',
				type: 'numeric',
				explanation: child
			}
		}
	})(rule)

	return {
		// Pas de propriété explanation et jsx ici car on est parti du (mauvais) principe que 'non applicable si' et 'formule' sont particuliers, alors qu'ils pourraient être rangé avec les autres mécanismes
		...parsedRoot,
		evaluate,
		collectMissing
	}
}

let evolveCond = (name, rule, rules) => value => {
	let evaluate = (situationGate, parsedRules, node) => {
		let collectMissing = node => collectNodeMissing(node.explanation)
		let explanation = evaluateNode(
				situationGate,
				parsedRules,
				node.explanation
			),
			nodeValue = explanation.nodeValue
		return rewriteNode(node, nodeValue, explanation, collectMissing)
	}

	let child = treat(rules, rule)(value)

	let jsx = (nodeValue, explanation) => (
		<Node
			classes="ruleProp mecanism cond"
			name={name}
			value={nodeValue}
			child={
				explanation.category === 'variable' ? (
					<div className="node">{makeJsx(explanation)}</div>
				) : (
					makeJsx(explanation)
				)
			}
		/>
	)

	return {
		evaluate,
		jsx,
		category: 'ruleProp',
		rulePropType: 'cond',
		name,
		type: 'boolean',
		explanation: child
	}
}

export let getTargets = (target, rules) => {
	let multiSimulation = R.path(['simulateur', 'objectifs'])(target)
	let targets = multiSimulation
		? // On a un simulateur qui définit une liste d'objectifs
		multiSimulation
			.map(n => disambiguateRuleReference(rules, target, n))
			.map(n => findRuleByDottedName(rules, n))
		: // Sinon on est dans le cas d'une simple variable d'objectif
		[target]

	return targets
}

export let analyse = (rules, targetInput) => situationGate => {
	clearDict()
	let targetNames =
			typeof targetInput === 'string' ? [targetInput] : targetInput,
		/*
		La fonction treatRuleRoot va descendre l'arbre de la règle `rule` et produire un AST, un objet contenant d'autres objets contenant d'autres objets...
		Aujourd'hui, une règle peut avoir (comme propriétés à parser) `non applicable si` et `formule`,
		qui ont elles-mêmes des propriétés de type mécanisme (ex. barème) ou des expressions en ligne (ex. maVariable + 3).
		Ces mécanismes où variables sont descendues à leur tour grâce à `treat()`.
		Lors de ce traitement, des fonctions 'evaluate', `collectMissingVariables` et `jsx` sont attachés aux objets de l'AST
		*/
		treatOne = rule => treatRuleRoot(rules, rule),
		//On fait ainsi pour chaque règle de la base.
		parsedRules = R.map(treatOne, rules),
		// TODO: we should really make use of namespaces at this level, in particular
		// setRule in Rule.js needs to get smarter and pass dottedName
		parsedTargets = targetNames.map(t => findRuleByName(parsedRules, t)),
		/*
			Ce n'est que dans cette nouvelle étape que l'arbre est vraiment évalué.
			Auparavant, l'évaluation était faite lors de la construction de l'AST.
		*/
		targets = R.chain(pt => getTargets(pt, parsedRules), parsedTargets).map(t =>
			evaluateNode(situationGate, parsedRules, t)
		)

	return {
		targets,
		parsedRules
	}
}
