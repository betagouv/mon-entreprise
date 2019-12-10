import { decompose } from 'Engine/mecanisms/utils'
import variations from 'Engine/mecanisms/variations'
import { inferUnit } from 'Engine/units'
import {
	add,
	any,
	curry,
	equals,
	evolve,
	filter,
	find,
	head,
	is,
	isEmpty,
	keys,
	map,
	max,
	mergeWith,
	min,
	path,
	pipe,
	pluck,
	prop,
	reduce,
	subtract,
	toPairs
} from 'ramda'
import React from 'react'
import { Trans } from 'react-i18next'
import 'react-virtualized/styles.css'
import {
	bonus,
	collectNodeMissing,
	defaultNode,
	evaluateArray,
	evaluateNode,
	evaluateObject,
	makeJsx,
	mergeAllMissing,
	mergeMissing,
	parseObject
} from './evaluation'
import Allègement from './mecanismViews/Allègement'
import { Node, SimpleRuleLink } from './mecanismViews/common'
import InversionNumérique from './mecanismViews/InversionNumérique'
import Product from './mecanismViews/Product'
import Somme from './mecanismViews/Somme'
import { disambiguateRuleReference, findRuleByDottedName } from './rules'
import { anyNull, val } from './traverse-common-functions'
import uniroot from './uniroot'

export let mecanismOneOf = (recurse, k, v) => {
	if (!is(Array, v)) throw new Error('should be array')

	let explanation = map(recurse, v)

	let jsx = (nodeValue, explanation) => (
		<Node
			classes="mecanism conditions list"
			name="une de ces conditions"
			value={nodeValue}
			child={
				<ul>
					{explanation.map(item => (
						<li key={item.name || item.text}>{makeJsx(item)}</li>
					))}
				</ul>
			}
		/>
	)

	let evaluate = (cache, situationGate, parsedRules, node) => {
		let evaluateOne = child =>
				evaluateNode(cache, situationGate, parsedRules, child),
			explanation = map(evaluateOne, node.explanation),
			values = pluck('nodeValue', explanation),
			nodeValue = any(equals(true), values)
				? true
				: any(equals(null), values)
				? null
				: false,
			// Unlike most other array merges of missing variables this is a "flat" merge
			// because "one of these conditions" tend to be several tests of the same variable
			// (e.g. contract type is one of x, y, z)
			missingVariables =
				nodeValue == null
					? reduce(mergeWith(max), {}, map(collectNodeMissing, explanation))
					: {}

		return { ...node, nodeValue, explanation, missingVariables }
	}

	return {
		evaluate,
		jsx,
		explanation,
		category: 'mecanism',
		name: 'une de ces conditions',
		type: 'boolean'
	}
}

export let mecanismAllOf = (recurse, k, v) => {
	if (!is(Array, v)) throw new Error('should be array')

	let explanation = map(recurse, v)

	let jsx = (nodeValue, explanation) => (
		<Node
			classes="mecanism conditions list"
			name="toutes ces conditions"
			value={nodeValue}
			child={
				<ul>
					{explanation.map(item => (
						<li key={item.name || item.text}>{makeJsx(item)}</li>
					))}
				</ul>
			}
		/>
	)

	let evaluate = (cache, situationGate, parsedRules, node) => {
		let evaluateOne = child =>
				evaluateNode(cache, situationGate, parsedRules, child),
			explanation = map(evaluateOne, node.explanation),
			values = pluck('nodeValue', explanation),
			nodeValue = any(equals(false), values)
				? false // court-circuit
				: any(equals(null), values)
				? null
				: true,
			missingVariables = nodeValue == null ? mergeAllMissing(explanation) : {}

		return { ...node, nodeValue, explanation, missingVariables }
	}

	return {
		evaluate: evaluate,
		jsx,
		explanation,
		category: 'mecanism',
		name: 'toutes ces conditions',
		type: 'boolean'
	}
}

export let mecanismNumericalSwitch = (recurse, k, v) => {
	// Si "l'aiguillage" est une constante ou une référence directe à une variable;
	// l'utilité de ce cas correspond à un appel récursif au mécanisme
	if (is(String, v)) return recurse(v)

	if (!is(Object, v) || keys(v).length == 0) {
		throw new Error(
			'Le mécanisme "aiguillage numérique" et ses sous-logiques doivent contenir au moins une proposition'
		)
	}

	// les termes sont les couples (condition, conséquence) de l'aiguillage numérique
	let terms = toPairs(v)

	// la conséquence peut être un 'string' ou un autre aiguillage numérique
	let parseCondition = ([condition, consequence]) => {
		let conditionNode = recurse(condition), // can be a 'comparison', a 'variable'
			consequenceNode = mecanismNumericalSwitch(recurse, condition, consequence)

		let evaluate = (cache, situationGate, parsedRules, node) => {
			let explanation = evolve(
					{
						condition: curry(evaluateNode)(cache, situationGate, parsedRules),
						consequence: curry(evaluateNode)(cache, situationGate, parsedRules)
					},
					node.explanation
				),
				leftMissing = explanation.condition.missingVariables,
				investigate = explanation.condition.nodeValue !== false,
				rightMissing = investigate
					? explanation.consequence.missingVariables
					: {},
				missingVariables = mergeMissing(bonus(leftMissing), rightMissing)

			return {
				...node,
				explanation,
				missingVariables,
				nodeValue: explanation.consequence.nodeValue,
				condValue: explanation.condition.nodeValue
			}
		}

		let jsx = (nodeValue, { condition, consequence }) => (
			<div className="condition">
				{makeJsx(condition)}
				<div>{makeJsx(consequence)}</div>
			</div>
		)

		return {
			evaluate,
			jsx,
			explanation: { condition: conditionNode, consequence: consequenceNode },
			category: 'condition',
			text: condition,
			condition: conditionNode,
			type: 'boolean'
		}
	}

	let evaluateTerms = (cache, situationGate, parsedRules, node) => {
		let evaluateOne = child =>
				evaluateNode(cache, situationGate, parsedRules, child),
			explanation = map(evaluateOne, node.explanation),
			nonFalsyTerms = filter(node => node.condValue !== false, explanation),
			getFirst = o => pipe(head, prop(o))(nonFalsyTerms),
			nodeValue =
				// voilà le "numérique" dans le nom de ce mécanisme : il renvoie zéro si aucune condition n'est vérifiée
				isEmpty(nonFalsyTerms)
					? 0
					: // c'est un 'null', on renvoie null car des variables sont manquantes
					getFirst('condValue') == null
					? null
					: // c'est un true, on renvoie la valeur de la conséquence
					  getFirst('nodeValue'),
			choice = find(node => node.condValue, explanation),
			missingVariables = choice
				? choice.missingVariables
				: mergeAllMissing(explanation)

		return { ...node, nodeValue, explanation, missingVariables }
	}

	let explanation = map(parseCondition, terms)

	let jsx = (nodeValue, explanation) => (
		<Node
			classes="mecanism numericalSwitch list"
			name="aiguillage numérique"
			value={nodeValue}
			child={
				<ul>
					{explanation.map(item => (
						<li key={item.name || item.text}>{makeJsx(item)}</li>
					))}
				</ul>
			}
		/>
	)

	return {
		evaluate: evaluateTerms,
		jsx,
		explanation,
		category: 'mecanism',
		name: 'aiguillage numérique',
		type: 'boolean || numeric' // lol !
	}
}

export let findInversion = (situationGate, parsedRules, v, dottedName) => {
	let inversions = v.avec
	if (!inversions)
		throw new Error(
			"Une formule d'inversion doit préciser _avec_ quoi on peut inverser la variable"
		)
	/*
	Quelle variable d'inversion possible a sa valeur renseignée dans la situation courante ?
	Ex. s'il nous est demandé de calculer le salaire de base, est-ce qu'un candidat à l'inversion, comme
	le salaire net, a été renseigné ?
	*/
	let candidates = inversions
			.map(i =>
				disambiguateRuleReference(
					Object.values(parsedRules),
					parsedRules[dottedName],
					i
				)
			)
			.map(name => {
				let userInput = situationGate(name) != undefined
				let rule = findRuleByDottedName(parsedRules, name)
				if (!userInput) return null
				return {
					fixedObjectiveRule: rule,
					userInput,
					fixedObjectiveValue: situationGate(name)
				}
			}),
		candidateWithUserInput = candidates.find(c => c && c.userInput)

	return (
		candidateWithUserInput || candidates.find(candidate => candidate != null)
	)
}

let doInversion = (oldCache, situationGate, parsedRules, v, dottedName) => {
	let inversion = findInversion(situationGate, parsedRules, v, dottedName)

	if (!inversion)
		return {
			missingVariables: { [dottedName]: 1 },
			nodeValue: null
		}
	let { fixedObjectiveValue, fixedObjectiveRule } = inversion

	let inversionCache = {}
	let fx = x => {
		inversionCache = { parseLevel: oldCache.parseLevel + 1, op: '<' }
		let v = evaluateNode(
			inversionCache, // with an empty cache
			n =>
				dottedName === n
					? x
					: n === 'sys.filter'
					? undefined
					: situationGate(n),
			parsedRules,
			fixedObjectiveRule
		)

		return v
	}

	// si fx renvoie null pour une valeur numérique standard, disons 1000, on peut
	// considérer que l'inversion est impossible du fait de variables manquantes
	// TODO fx peut être null pour certains x, et valide pour d'autres : on peut implémenter ici le court-circuit
	let attempt = fx(1000)
	if (attempt.nodeValue == null) {
		return attempt
	}

	let tolerance = 0.1,
		// cette fonction détermine la racine d'une fonction sans faire trop d'itérations
		nodeValue = uniroot(
			x => {
				let y = fx(x)
				return y.nodeValue - fixedObjectiveValue
			},
			0.1,
			1000000000,
			tolerance,
			10
		)

	return {
		nodeValue,
		missingVariables: {},
		inversionCache,
		inversedWith: {
			rule: fixedObjectiveRule,
			value: fixedObjectiveValue
		}
	}
}

export let mecanismInversion = dottedName => (recurse, k, v) => {
	let evaluate = (cache, situationGate, parsedRules, node) => {
		let inversion =
				// avoid the inversion loop !
				situationGate(dottedName) == undefined &&
				doInversion(cache, situationGate, parsedRules, v, dottedName),
			// TODO - ceci n'est pas vraiment satisfaisant
			nodeValue = situationGate(dottedName)
				? Number.parseFloat(situationGate(dottedName))
				: inversion.nodeValue,
			missingVariables = inversion.missingVariables

		if (nodeValue === undefined)
			cache.inversionFail = {
				given: inversion.inversedWith.rule.dottedName,
				estimated: dottedName
			}
		let evaluatedNode = {
			...node,
			nodeValue,
			explanation: {
				...node.explanation,
				inversedWith: inversion?.inversedWith
			},
			missingVariables
		}
		// TODO - we need this so that ResultsGrid will work, but it's
		// just not right
		toPairs(inversion.inversionCache).map(([k, v]) => (cache[k] = v))
		return evaluatedNode
	}

	return {
		...v,
		evaluate,
		explanation: evolve({ avec: map(recurse) }, v),
		jsx: InversionNumérique,
		category: 'mecanism',
		name: 'inversion numérique',
		type: 'numeric'
	}
}

export let mecanismSum = (recurse, k, v) => {
	let explanation = v.map(recurse)

	let evaluate = evaluateArray(add, 0)

	return {
		evaluate,
		// eslint-disable-next-line
		jsx: (nodeValue, explanation, _, unit) => (
			<Somme nodeValue={nodeValue} explanation={explanation} unit={unit} />
		),
		explanation,
		category: 'mecanism',
		name: 'somme',
		type: 'numeric',
		unit: inferUnit(
			'+',
			explanation.map(r => r.unit)
		)
	}
}

export let mecanismReduction = (recurse, k, v) => {
	let objectShape = {
		assiette: false,
		abattement: defaultNode(0),
		plafond: defaultNode(Infinity),
		franchise: defaultNode(0)
	}

	let effect = ({ assiette, abattement, plafond, franchise, décote }) => {
		let v_assiette = val(assiette)

		if (v_assiette == null) return null

		let montantFranchiséDécoté =
			val(franchise) && v_assiette < val(franchise)
				? 0
				: décote
				? (function() {
						let plafondDécote = val(décote.plafond),
							taux = val(décote.taux)

						return v_assiette > plafondDécote
							? v_assiette
							: max(0, (1 + taux) * v_assiette - taux * plafondDécote)
				  })()
				: v_assiette

		return abattement
			? val(abattement) == null
				? montantFranchiséDécoté === 0
					? 0
					: null
				: abattement.type === 'percentage'
				? max(
						0,
						montantFranchiséDécoté -
							min(val(plafond), val(abattement) * montantFranchiséDécoté)
				  )
				: max(0, montantFranchiséDécoté - min(val(plafond), val(abattement)))
			: montantFranchiséDécoté
	}

	let base = parseObject(recurse, objectShape, v),
		explanation = v.décote
			? {
					...base,
					décote: map(recurse, v.décote)
			  }
			: base,
		evaluate = evaluateObject(objectShape, effect)

	return {
		evaluate,
		jsx: Allègement,
		explanation,
		category: 'mecanism',
		name: 'allègement',
		type: 'numeric',
		unit: explanation?.assiette?.unit
	}
}

export let mecanismProduct = (recurse, k, v) => {
	if (v.composantes) {
		//mécanisme de composantes. Voir known-mecanisms.md/composantes
		return decompose(recurse, k, v)
	}
	if (v.variations) {
		return variations(recurse, k, v, true)
	}

	let objectShape = {
		assiette: false,
		taux: defaultNode(1),
		facteur: defaultNode(1),
		plafond: defaultNode(Infinity)
	}
	let effect = ({ assiette, taux, facteur, plafond }) => {
		let mult = (base, rate, facteur, plafond) =>
			Math.min(base, plafond) * rate * facteur
		return {
			nodeValue:
				val(taux) === 0 ||
				val(taux) === false ||
				val(assiette) === 0 ||
				val(facteur) === 0
					? 0
					: anyNull([taux, assiette, facteur, plafond])
					? null
					: mult(val(assiette), val(taux), val(facteur), val(plafond)),
			additionalExplanation: { plafondActif: val(assiette) > val(plafond) }
		}
	}

	let explanation = parseObject(recurse, objectShape, v),
		evaluate = evaluateObject(objectShape, effect)

	return {
		evaluate,
		jsx: Product,
		explanation,
		category: 'mecanism',
		name: 'multiplication',
		type: 'numeric',
		unit: inferUnit(
			'*',
			[explanation.assiette, explanation.taux, explanation.facteur].map(
				el => el.unit
			)
		)
	}
}

export let mecanismMax = (recurse, k, v) => {
	let explanation = v.map(recurse)

	let evaluate = evaluateArray(max, Number.NEGATIVE_INFINITY)

	let jsx = (nodeValue, explanation) => (
		<Node
			classes="mecanism list maximum"
			name="le maximum de"
			value={nodeValue}
			child={
				<ul>
					{explanation.map((item, i) => (
						<li key={i}>
							<div className="description">{v[i].description}</div>
							{makeJsx(item)}
						</li>
					))}
				</ul>
			}
		/>
	)

	return {
		evaluate,
		jsx,
		explanation,
		type: 'numeric',
		category: 'mecanism',
		name: 'le maximum de',
		unit: explanation[0].unit
	}
}

export let mecanismMin = (recurse, k, v) => {
	let explanation = v.map(recurse)

	let evaluate = evaluateArray(min, Infinity)

	let jsx = (nodeValue, explanation) => (
		<Node
			classes="mecanism list minimum"
			name="le minimum de"
			value={nodeValue}
			child={
				<ul>
					{explanation.map((item, i) => (
						<li key={i}>
							<div className="description">{v[i].description}</div>
							{makeJsx(item)}
						</li>
					))}
				</ul>
			}
		/>
	)

	return {
		evaluate,
		jsx,
		explanation,
		type: 'numeric',
		category: 'mecanism',
		name: 'le minimum de',
		unit: explanation[0].unit
	}
}

export let mecanismComplement = (recurse, k, v) => {
	if (v.composantes) {
		//mécanisme de composantes. Voir known-mecanisms.md/composantes
		return decompose(recurse, k, v)
	}

	let objectShape = { cible: false, montant: false }
	let effect = ({ cible, montant }) => {
		let nulled = val(cible) == null
		return nulled ? null : subtract(val(montant), min(val(cible), val(montant)))
	}
	let explanation = parseObject(recurse, objectShape, v)

	return {
		evaluate: evaluateObject(objectShape, effect),
		explanation,
		type: 'numeric',
		category: 'mecanism',
		name: 'complément pour atteindre',
		// eslint-disable-next-line
		jsx: (nodeValue, explanation) => (
			<Node
				classes="mecanism list complement"
				name="complément"
				value={nodeValue}
				child={
					<ul className="properties">
						<li key="cible">
							<span className="key">
								<Trans>cible</Trans>:{' '}
							</span>
							<span className="value">{makeJsx(explanation.cible)}</span>
						</li>
						<li key="mini">
							<span className="key">
								<Trans>montant à atteindre</Trans>:{' '}
							</span>
							<span className="value">{makeJsx(explanation.montant)}</span>
						</li>
					</ul>
				}
			/>
		)
	}
}

export let mecanismSynchronisation = (recurse, k, v) => {
	let evaluate = (cache, situationGate, parsedRules, node) => {
		let APIExplanation = evaluateNode(
			cache,
			situationGate,
			parsedRules,
			node.explanation.API
		)

		let valuePath = v.chemin.split(' . ')

		let nodeValue =
			val(APIExplanation) == null ? null : path(valuePath, val(APIExplanation))

		// If the API gave a non null value, then some of its props may be null (the API can be composed of multiple API, some failing). Then this prop will be set to the default value defined in the API's rule
		let safeNodeValue =
			nodeValue == null && val(APIExplanation) != null
				? path(valuePath, APIExplanation.explanation.defaultValue)
				: nodeValue

		let missingVariables =
			val(APIExplanation) === null ? { [APIExplanation.dottedName]: 1 } : {}
		let explanation = { ...v, API: APIExplanation }
		return { ...node, nodeValue: safeNodeValue, explanation, missingVariables }
	}

	return {
		explanation: { ...v, API: recurse(v.API) },
		evaluate,
		jsx: function Synchronisation(nodeValue, explanation) {
			return (
				<p>
					Obtenu à partir de la saisie <SimpleRuleLink rule={explanation.API} />
				</p>
			)
		},
		category: 'mecanism',
		name: 'synchronisation'
	}
}

export let mecanismError = (recurse, k, v) => {
	throw new Error("Le mécanisme '" + k + "' est inconnu !" + v)
}
export let mecanismOnePossibility = dottedName => (recurse, k, v) => ({
	...v,
	'une possibilité': 'oui',
	evaluate: (cache, situationGate, parsedRules, node) => ({
		...node,
		missingVariables: { [dottedName]: 1 }
	})
})
