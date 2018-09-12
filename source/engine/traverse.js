import { treatString, treatNumber, treatObject, treatOther } from './treat'

import React from 'react'
import {
	findRuleByDottedName,
	disambiguateRuleReference,
	findRule
} from './rules'
import {
	curry,
	chain,
	cond,
	evolve,
	path,
	map,
	merge,
	keys,
	is,
	T
} from 'ramda'
import { Node } from './mecanismViews/common'
import {
	evaluateNode,
	rewriteNode,
	makeJsx,
	mergeMissing,
	bonus
} from './evaluation'
import { anyNull, val, undefOrTrue } from './traverse-common-functions'

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

export let treat = (rules, rule) => rawNode => {
	let onNodeType = cond([
		[is(String), treatString(rules, rule)],
		[is(Number), treatNumber],
		[is(Object), treatObject(rules, rule)],
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
		: isApplicable === false
			? 0
			: formuleValue == 0
				? 0
				: null

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
			formMissing =
				(collectInFormule && formule && formule.missingVariables) || {},
			// On veut abaisser le score des conséquences par rapport aux conditions,
			// mais seulement dans le cas où une condition est effectivement présente
			hasCondition = keys(condMissing).length > 0,
			missingVariables = mergeMissing(
				bonus(condMissing, hasCondition),
				formMissing
			)

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

	let controls =
		rule['contrôles'] &&
		rule['contrôles'].map(control => {
			let testExpression = treatString(rules, rule)(control.si)
			if (!testExpression.explanation)
				throw new Error(
					'Ce contrôle ne semble pas être compris :' + control['si']
				)

			let otherVariables = testExpression.explanation.filter(
				node =>
					node.category === 'variable' && node.dottedName !== rule.dottedName
			)
			let isInputControl = !otherVariables.length,
				level = control['niveau']

			if (level === 'bloquant' && !isInputControl) {
				throw new Error(
					'Un contrôle ne peut être bloquant et invoquer des calculs de variables' +
						control['si'] +
						level
				)
			}

			return {
				dottedName: rule.dottedName,
				level: control['niveau'],
				test: control['si'],
				message: control['message'],
				testExpression,
				solution: control['solution'],
				isInputControl
			}
		})

	return {
		// Pas de propriété explanation et jsx ici car on est parti du (mauvais) principe que 'non applicable si' et 'formule' sont particuliers, alors qu'ils pourraient être rangé avec les autres mécanismes
		...parsedRoot,
		evaluate,
		parsed: true,
		controls
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

let evaluateControls = blocking => (parsedRules, situationGate) => {
	return chain(
		({ controls, dottedName }) =>
			situationGate(dottedName) != undefined &&
			controls &&
			controls
				.filter(
					({ level }) =>
						blocking ? level === 'bloquant' : level !== 'bloquant'
				)
				.map(control => ({
					...control,
					evaluated: evaluateNode(
						{},
						situationGate,
						parsedRules,
						control.testExpression
					)
				}))
				.filter(({ evaluated: { nodeValue } }) => nodeValue)
	)(parsedRules).filter(found => found)
}

export let analyseMany = (parsedRules, targetNames) => situationGate => {
	// TODO: we should really make use of namespaces at this level, in particular
	// setRule in Rule.js needs to get smarter and pass dottedName
	let cache = { parseLevel: 0 }

	// These controls do not trigger the evaluation of variables of the system : they are input controls
	// This is necessary because our evaluation implementation is not yet fast enough to not freeze slow mobile devices
	// They could be implemented directly at the redux-form level, but they should also be triggered by the engine used as a library
	let blockingInputControls = evaluateControls(true)(parsedRules, situationGate)
	if (blockingInputControls.length)
		return {
			blockingInputControls
		}
	let nonBlockingControls = evaluateControls(false)(parsedRules, situationGate)

	let parsedTargets = targetNames.map(t => findRule(parsedRules, t)),
		targets = chain(pt => getTargets(pt, parsedRules), parsedTargets).map(t =>
			evaluateNode(cache, situationGate, parsedRules, t)
		)

	// Don't use 'dict' for anything else than ResultsGrid
	return { targets, cache, controls: nonBlockingControls }
}

export let analyse = (parsedRules, target) => {
	return analyseMany(parsedRules, [target])
}
