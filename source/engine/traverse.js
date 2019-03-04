import { treatString, treatNumber, treatObject, treatOther } from './treat'

import React from 'react'
import {
	findRuleByDottedName,
	disambiguateRuleReference,
	findRule,
	findParentDependency
} from './rules'
import {
	chain,
	cond,
	evolve,
	path,
	map,
	mergeAll,
	keys,
	is,
	T,
	pipe,
	pick
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
import { ShowValuesConsumer } from 'Components/rule/ShowValuesContext'

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

export let treatRuleRoot = (rules, rule) => {
	/*
		The treatRuleRoot function will traverse the tree of the `rule` and produce an AST, an object containing other objects containing other objects...
		Some of the attributes of the rule are dynamic, they need to be parsed. It is the case of  `non applicable si`, `applicable si`, `formule`, `contrôles`.
		These attributes' values themselves may have  mechanism properties (e. g. `barème`) or inline expressions (e. g. `maVariable + 3`).
		These mechanisms or variables are in turn traversed by `treat()`. During this processing, 'evaluate' and'jsx' functions are attached to the objects of the AST. They will be evaluated during the evaluation phase, called "analyse".
*/

	let evaluate = (cache, situationGate, parsedRules, node) => {
		//		console.log((cache.op || ">").padStart(cache.parseLevel),rule.dottedName)
		cache.parseLevel++

		let evaluatedAttributes = pipe(
				pick(['parentDependency', 'non applicable si', 'applicable si']),
				map(value => evaluateNode(cache, situationGate, parsedRules, value))
			)(node),
			{
				parentDependency,
				'non applicable si': notApplicable,
				'applicable si': applicable
			} = evaluatedAttributes,
			isApplicable =
				val(parentDependency) === false
					? false
					: val(notApplicable) === true
					? false
					: val(applicable) === false
					? false
					: anyNull([notApplicable, applicable, parentDependency])
					? null
					: !val(notApplicable) && undefOrTrue(val(applicable)),
			evaluateFormula = () =>
				node.formule
					? evaluateNode(cache, situationGate, parsedRules, node.formule)
					: {},
			// evaluate the formula lazily, only if the applicability is known and true
			evaluatedFormula =
				isApplicable === true
					? evaluateFormula()
					: isApplicable === false
					? {
							...node.formule,
							missingVariables: {},
							nodeValue: 0
					  }
					: {
							...node.formule,
							missingVariables: {},
							nodeValue: null
					  },
			{
				missingVariables: formulaMissingVariables,
				nodeValue
			} = evaluatedFormula

		// if isApplicable === true
		// evaluateControls
		// attache them to the node for further usage
		// do not output missingVariables for now

		let condMissing =
				isApplicable === false
					? {}
					: mergeAll([
							parentDependency?.missingVariables || {},
							notApplicable?.missingVariables || {},
							applicable?.missingVariables || {}
					  ]),
			// On veut abaisser le score des conséquences par rapport aux conditions,
			// mais seulement dans le cas où une condition est effectivement présente
			hasCondition = keys(condMissing).length > 0,
			missingVariables = mergeMissing(
				bonus(condMissing, hasCondition),
				formulaMissingVariables
			)

		let evaluateControls = node.contrôles && val(parentDependency) !== false
		console.log(node.name, evaluateControls)
		let contrôles =
			evaluateControls &&
			node.contrôles.map(control => ({
				...control,
				evaluated: evaluateNode(
					cache,
					situationGate,
					parsedRules,
					control.testExpression
				)
			}))

		cache.parseLevel--
		//		if (keys(condMissing).length) console.log("".padStart(cache.parseLevel-1),{conditions:condMissing, formule:formMissing})
		//		else console.log("".padStart(cache.parseLevel-1),{formule:formMissing})
		return {
			...node,
			...evaluatedAttributes,
			...{ formule: evaluatedFormula },
			contrôles,
			nodeValue,
			isApplicable,
			missingVariables
		}
	}

	let parentDependency = findParentDependency(rules, rule)

	let root = { ...rule, ...(parentDependency ? { parentDependency } : {}) }

	let parsedRoot = evolve({
		// Voilà les attributs d'une règle qui sont aujourd'hui dynamiques, donc à traiter
		// Les métadonnées d'une règle n'en font pas aujourd'hui partie

		// condition d'applicabilité de la règle
		parentDependency: parent => {
			let node = treat(rules, rule)(parent.dottedName)

			let jsx = (nodeValue, explanation) => (
				<ShowValuesConsumer>
					{showValues =>
						!showValues ? (
							<div>Active seulement si {makeJsx(explanation)}</div>
						) : nodeValue === true ? (
							<div>Active car {makeJsx(explanation)}</div>
						) : nodeValue === false ? (
							<div>Non active car {makeJsx(explanation)}</div>
						) : null
					}
				</ShowValuesConsumer>
			)

			return {
				evaluate: (cache, situation, parsedRules) =>
					node.evaluate(cache, situation, parsedRules, node),
				jsx,
				category: 'ruleProp',
				rulePropType: 'cond',
				name: 'parentDependency',
				type: 'numeric',
				explanation: node
			}
		},
		'non applicable si': evolveCond('non applicable si', rule, rules),
		'applicable si': evolveCond('applicable si', rule, rules),
		// formule de calcul
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
		},
		contrôles: map(control => {
			let testExpression = treat(rules, rule)(control.si)
			if (!testExpression.explanation)
				throw new Error(
					'Ce contrôle ne semble pas être compris :' + control['si']
				)

			return {
				dottedName: rule.dottedName,
				level: control['niveau'],
				test: control['si'],
				message: control['message'],
				testExpression,
				solution: control['solution']
			}
		})
	})(root)

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
	let cache = { parseLevel: 0 }

	let parsedTargets = targetNames.map(t => {
			let parsedTarget = findRule(parsedRules, t)
			if (!parsedTarget)
				throw new Error(
					`L'objectif de calcul "${t}" ne semble pas  exister dans la base de règles`
				)
			return parsedTarget
		}),
		targets = chain(pt => getTargets(pt, parsedRules), parsedTargets).map(
			t =>
				cache[t.dottedName] || // This check exists because it is not done in treatRuleRoot's eval, while it is in treatVariable. This should be merged : we should probably call treatVariable here : targetNames could be expressions (hence with filters) TODO
				evaluateNode(cache, situationGate, parsedRules, t)
		)
	return { targets, cache }
}

export let analyse = (parsedRules, target) => {
	return analyseMany(parsedRules, [target])
}
