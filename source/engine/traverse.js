import React from 'react'
import {
	findRuleByDottedName,
	disambiguateRuleReference,
	findRuleByName,
	findRule
} from './rules'
import { evaluateVariable } from './variables'
import {
	contains,
	propEq,
	curry,
	chain,
	cond,
	evolve,
	equals,
	concat,
	path,
	divide,
	multiply,
	map,
	merge,
	length,
	flatten,
	intersection,
	keys,
	is,
	propOr,
	always,
	head,
	T,
	gte,
	lte,
	lt,
	gt,
	add,
	subtract
} from 'ramda'
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
	mecanismInversion,
	mecanismReduction
} from './mecanisms'
import {
	evaluateNode,
	rewriteNode,
	makeJsx,
	mergeMissing,
	mergeAllMissing,
	bonus
} from './evaluation'
import {
	anyNull,
	val,
	undefOrTrue
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

// TODO - this is becoming overly specific
let fillFilteredVariableNode = (rules, rule) => (filter, parseResult) => {
	let evaluateFiltered = originalEval => (
		cache,
		situation,
		parsedRules,
		node
	) => {
		let newSituation = name => (name == 'sys.filter' ? filter : situation(name))
		return originalEval(cache, newSituation, parsedRules, node)
	}
	let node = fillVariableNode(rules, rule, filter)(parseResult),
		// Decorate node with who's paying
		cotisation = { ...node.cotisation, 'dû par': filter }

	return {
		...node,
		cotisation,
		evaluate: evaluateFiltered(node.evaluate)
	}
}

let fillVariableNode = (rules, rule, filter) => parseResult => {
	let evaluate = (cache, situation, parsedRules, node) => {
		let dottedName = node.dottedName,
			// On va vérifier dans le cache courant, dict, si la variable n'a pas été déjà évaluée
			// En effet, l'évaluation dans le cas d'une variable qui a une formule, est coûteuse !
			cacheName = dottedName + (filter ? '.' + filter : ''),
			cached = cache[cacheName]
		if (cached) {
			return cached
		}

		let variable = findRuleByDottedName(parsedRules, dottedName),
			variableIsCalculable = variable.formule != null,
			situationValue = evaluateVariable(situation, dottedName, variable),
			needsEvaluation = (variableIsCalculable && situationValue == null),
			parsedRule = needsEvaluation
				 ? evaluateNode(cache, situation, parsedRules, variable)
				 : variable,
			// evaluateVariable renvoit la valeur déduite de la situation courante renseignée par l'utilisateur
			explanation = parsedRule,
			nodeValue =
				situationValue != null
					? situationValue // cette variable a été directement renseignée
					: variableIsCalculable
						? parsedRule.nodeValue // la valeur du calcul fait foi
						: null, // elle restera donc nulle
			missingVariables = nodeValue != null // notamment si situationValue != null
					? {}
					: variableIsCalculable
						? parsedRule.missingVariables
						: {[dottedName]:1}

		cache[cacheName] = rewriteNode(node, nodeValue, explanation, missingVariables)
		return cache[cacheName]
	}

	let { fragments } = parseResult,
		variablePartialName = fragments.join(' . '),
		dottedName = disambiguateRuleReference(rules, rule, variablePartialName)

	let jsx = nodeValue => (
		<Leaf
			classes="variable"
			name={fragments.join(' . ')}
			dottedName={dottedName}
			value={nodeValue}
		/>
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
	let evaluate = (cache, situation, parsedRules, node) => {
		let explanation = evaluateNode(
				cache,
				situation,
				parsedRules,
				node.explanation
			),
			nodeValue = explanation.nodeValue == null ? null : !explanation.nodeValue,
			missingVariables = explanation.missingVariables

		return rewriteNode(node, nodeValue, explanation, missingVariables)
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
				throw "Attention ! L'expression <" +
					rawNode +
					'> ne peut être traitée de façon univoque'

			if (
				!contains(parseResult.category)([
					'variable',
					'calcExpression',
					'filteredVariable',
					'comparison',
					'negatedVariable',
					'percentage'
				])
			)
				throw "Attention ! Erreur de traitement de l'expression : " + rawNode

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
				let evaluate = (cache, situation, parsedRules, node) => {
					let operatorFunction = {
							'*': multiply,
							'/': divide,
							'+': add,
							'-': subtract,
							'<': lt,
							'<=': lte,
							'>': gt,
							'>=': gte,
							'=': equals,
							'!=': (a, b) => !equals(a, b)
						}[node.operator],
						explanation = map(
							curry(evaluateNode)(cache, situation, parsedRules),
							node.explanation
						),
						value1 = explanation[0].nodeValue,
						value2 = explanation[1].nodeValue,
						nodeValue =
							value1 == null || value2 == null
								? null
								: operatorFunction(value1, value2),
						missingVariables = mergeMissing(
							explanation[0].missingVariables,
							explanation[1].missingVariables)

					return rewriteNode(node, nodeValue, explanation, missingVariables)
				}

				let fillFiltered = parseResult =>
					fillFilteredVariableNode(rules, rule)(
						parseResult.filter,
						parseResult.variable
					)
				let fillVariable = fillVariableNode(rules, rule),
					filledExplanation = parseResult.explanation.map(
						cond([
							[propEq('category', 'variable'), fillVariable],
							[propEq('category', 'filteredVariable'), fillFiltered],
							[
								propEq('category', 'value'),
								node => ({
									nodeValue: node.nodeValue,
									jsx: nodeValue => <span className="value">{nodeValue}</span>
								})
							],
							[
								propEq('category', 'percentage'),
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
			throw new Error(
				'Cette donnée : ' + rawNode + ' doit être un Number, String ou Object'
			)
		},
		treatObject = rawNode => {
			let mecanisms = intersection(keys(rawNode), keys(knownMecanisms))

			if (mecanisms.length != 1) {
				console.log(
					// eslint-disable-line no-console
					'Erreur : On ne devrait reconnaître que un et un seul mécanisme dans cet objet',
					mecanisms,
					rawNode
				)
				throw new Error('OUPS !')
			}

			let k = head(mecanisms),
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
					'une possibilité': always({
						...v,
						'une possibilité': 'oui',
						missingVariables: {[rule.dottedName]:1}
					}),
					inversion: mecanismInversion(rule.dottedName),
					allègement: mecanismReduction
				},
				action = propOr(mecanismError, k, dispatch)

			return action(reTreat, k, v)
		}

	let onNodeType = cond([
		[is(String), treatString],
		[is(Number), treatNumber],
		[is(Object), treatObject],
		[T, treatOther]
	])

	let defaultEvaluate = (cache, situationGate, parsedRules, node) => node
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
	/*
	La fonction treatRuleRoot va descendre l'arbre de la règle `rule` et produire un AST, un objet contenant d'autres objets contenant d'autres objets...
	Aujourd'hui, une règle peut avoir (comme propriétés à parser) `non applicable si` et `formule`,
	qui ont elles-mêmes des propriétés de type mécanisme (ex. barème) ou des expressions en ligne (ex. maVariable + 3).
	Ces mécanismes où variables sont descendues à leur tour grâce à `treat()`.
	Lors de ce traitement, des fonctions 'evaluate' et `jsx` sont attachés aux objets de l'AST
	*/
	let evaluate = (cache, situationGate, parsedRules, node) => {
//		console.log((cache.op || ">").padStart(cache.parseLevel),rule.dottedName)
		cache.parseLevel++

		let evolveRule = curry(evaluateNode)(cache, situationGate, parsedRules),
			evaluated = evolve(
				{
					formule: evolveRule,
					'non applicable si': evolveRule,
					'applicable si': evolveRule
				},
				node
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

		let {
			formule,
			'non applicable si': notApplicable,
			'applicable si': applicable
		} = evaluated

		let condMissing =
				val(notApplicable) === true
					? {}
					: val(applicable) === false
						? {}
						: merge(
							(notApplicable && notApplicable.missingVariables) || {},
							(applicable && applicable.missingVariables) || {}
						),
			collectInFormule = isApplicable !== false,
			formMissing = (collectInFormule && formule.missingVariables) || {},
			// On veut abaisser le score des conséquences par rapport aux conditions,
			// mais seulement dans le cas où une condition est effectivement présente
			hasCondition = keys(condMissing).length > 0,
			missingVariables = mergeMissing(bonus(condMissing,hasCondition), formMissing)

		cache.parseLevel--
//		if (keys(condMissing).length) console.log("".padStart(cache.parseLevel-1),{conditions:condMissing, formule:formMissing})
//		else console.log("".padStart(cache.parseLevel-1),{formule:formMissing})
		return { ...evaluated, nodeValue, isApplicable, missingVariables }
	}

	let parsedRoot = evolve({
		// Voilà les attributs d'une règle qui sont aujourd'hui dynamiques, donc à traiter
		// Les métadonnées d'une règle n'en font pas aujourd'hui partie

		// condition d'applicabilité de la règle
		'non applicable si': evolveCond('non applicable si', rule, rules),
		'applicable si': evolveCond('applicable si', rule, rules),
		formule: value => {
			let evaluate = (cache, situationGate, parsedRules, node) => {
				let explanation = evaluateNode(
						cache,
						situationGate,
						parsedRules,
						node.explanation
					),
					nodeValue = explanation.nodeValue,
					missingVariables = explanation.missingVariables

				return rewriteNode(node, nodeValue, explanation, missingVariables)
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
		parsed: true
	}
}

let evolveCond = (name, rule, rules) => value => {
	let evaluate = (cache, situationGate, parsedRules, node) => {
		let explanation = evaluateNode(
				cache,
				situationGate,
				parsedRules,
				node.explanation
			),
			nodeValue = explanation.nodeValue,
			missingVariables = explanation.missingVariables

		return rewriteNode(node, nodeValue, explanation, missingVariables)
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
	let multiSimulation = path(['simulateur', 'objectifs'])(target)
	let targets = multiSimulation
		? // On a un simulateur qui définit une liste d'objectifs
		  multiSimulation
				.map(n => disambiguateRuleReference(rules, target, n))
				.map(n => findRuleByDottedName(rules, n))
		: // Sinon on est dans le cas d'une simple variable d'objectif
		  [target]

	return targets
}

export let parseAll = flatRules => {
	let treatOne = rule => treatRuleRoot(flatRules, rule)
	return map(treatOne, flatRules)
}

export let analyseMany = (parsedRules, targetNames) => situationGate => {
	// TODO: we should really make use of namespaces at this level, in particular
	// setRule in Rule.js needs to get smarter and pass dottedName
	let cache = {parseLevel: 0}

	let parsedTargets = targetNames.map(t => findRule(parsedRules, t)),
		targets = chain(pt => getTargets(pt, parsedRules), parsedTargets).map(t =>
			evaluateNode(cache, situationGate, parsedRules, t)
		)

	// Don't use 'dict' for anything else than ResultsGrid
	return { targets, cache }
}

export let analyse = (parsedRules, target) => {
	return analyseMany(parsedRules, [target])
}
