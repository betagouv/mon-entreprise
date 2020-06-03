import {
	any,
	equals,
	is,
	map,
	max,
	mergeWith,
	min,
	path,
	pluck,
	reduce
} from 'ramda'
import React from 'react'
import Allègement from './components/mecanisms/Allègement'
import { Mecanism } from './components/mecanisms/common'
import InversionNumérique from './components/mecanisms/InversionNumérique'
import Product from './components/mecanisms/Product'
import Recalcul from './components/mecanisms/Recalcul'
import Somme from './components/mecanisms/Somme'
import { RuleLinkWithContext } from './components/RuleLink'
import { typeWarning } from './error'
import {
	collectNodeMissing,
	defaultNode,
	evaluateArray,
	evaluateNode,
	evaluateObject,
	makeJsx,
	mergeAllMissing,
	parseObject
} from './evaluation'
import { decompose } from './mecanisms/utils'
import variations from './mecanisms/variations'
import { convertNodeToUnit } from './nodeUnits'
import uniroot from './uniroot'
import {
	areUnitConvertible,
	convertUnit,
	inferUnit,
	parseUnit,
	serializeUnit
} from './units'

export const mecanismOneOf = (recurse, k, v) => {
	if (!is(Array, v)) throw new Error('should be array')

	const explanation = map(recurse, v)

	const jsx = ({ nodeValue, explanation, unit }) => (
		<Mecanism name="une de ces conditions" value={nodeValue} unit={unit}>
			<ul>
				{explanation.map((item, i) => (
					<li key={i}>{makeJsx(item)}</li>
				))}
			</ul>
		</Mecanism>
	)

	const evaluate = (cache, situation, parsedRules, node) => {
		const evaluateOne = child =>
				evaluateNode(cache, situation, parsedRules, child),
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

export const mecanismAllOf = (recurse, k, v) => {
	if (!is(Array, v)) throw new Error('should be array')

	const explanation = map(recurse, v)

	const jsx = ({ nodeValue, explanation, unit }) => (
		<Mecanism name="toutes ces conditions" value={nodeValue} unit={unit}>
			<ul>
				{explanation.map((item, i) => (
					<li key={i}>{makeJsx(item)}</li>
				))}
			</ul>
		</Mecanism>
	)

	const evaluate = (cache, situation, parsedRules, node) => {
		const evaluateOne = child =>
				evaluateNode(cache, situation, parsedRules, child),
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

const evaluateInversion = (oldCache, situation, parsedRules, node) => {
	// TODO : take applicability into account here
	let inversedWith = node.explanation.inversionCandidates.find(
		n => situation[n.dottedName] != undefined
	)
	if (!inversedWith) {
		return {
			...node,
			missingVariables: {
				...Object.fromEntries(
					node.explanation.inversionCandidates.map(n => [n.dottedName, 1])
				),
				[node.explanation.ruleToInverse]: 1
			},
			nodeValue: null
		}
	}
	inversedWith = evaluateNode(oldCache, situation, parsedRules, inversedWith)

	let inversionCache
	function resetInversionCache() {
		inversionCache = {
			_meta: { ...oldCache._meta }
		}
		return inversionCache
	}
	const evaluateWithValue = (n: number) =>
		evaluateNode(
			resetInversionCache(),
			{
				...situation,
				[inversedWith.dottedName]: undefined,
				[node.explanation.ruleToInverse]: {
					nodeValue: n,
					unit: parsedRules[node.explanation.ruleToInverse].unit
				}
			},
			parsedRules,
			inversedWith
		)

	// si fx renvoie null pour une valeur numérique standard, disons 2000, on peut
	// considérer que l'inversion est impossible du fait de variables manquantes
	// TODO fx peut être null pour certains x, et valide pour d'autres : on peut implémenter ici le court-circuit
	const randomAttempt = evaluateWithValue(2000)
	const nodeValue =
		randomAttempt.nodeValue === null
			? null
			: // cette fonction détermine l'inverse d'une fonction sans faire trop d'itérations
			  uniroot(
					x => {
						const candidateNode = evaluateWithValue(x)
						return (
							candidateNode.nodeValue -
							// TODO: convertNodeToUnit migth return null or false
							(convertNodeToUnit(candidateNode.unit, inversedWith)
								.nodeValue as number)
						)
					},
					node.explanation.negativeValuesAllowed ? -1000000 : 0,
					100000000,
					0.1,
					10
			  )

	if (nodeValue === undefined) {
		oldCache._meta.inversionFail = true
	} else {
		// For performance reason, we transfer the inversion cache
		Object.entries(inversionCache).forEach(([k, value]) => {
			oldCache[k] = value
		})
	}

	return {
		...node,
		nodeValue: nodeValue ?? null,
		explanation: {
			...node.explanation,
			inversionFail: nodeValue === undefined,
			inversedWith
		},
		missingVariables: randomAttempt.missingVariables
	}
}

export const mecanismInversion = dottedName => (recurse, k, v) => {
	if (!v.avec) {
		throw new Error(
			"Une formule d'inversion doit préciser _avec_ quoi on peut inverser la variable"
		)
	}
	return {
		evaluate: evaluateInversion,
		unit: v.unité && parseUnit(v.unité),
		explanation: {
			ruleToInverse: dottedName,
			inversionCandidates: v.avec.map(recurse),
			negativeValuesAllowed: v['valeurs négatives possibles'] === 'oui'
		},
		jsx: InversionNumérique,
		category: 'mecanism',
		name: 'inversion numérique',
		type: 'numeric'
	}
}

export const mecanismRecalcul = dottedNameContext => (recurse, k, v) => {
	const evaluate = (cache, situation, parsedRules, node) => {
		if (cache._meta.inRecalcul) {
			return defaultNode(false)
		}

		const amendedSituation = Object.fromEntries(
			node.explanation.amendedSituation
				.map(([originRule, replacement]) => [
					evaluateNode(cache, situation, parsedRules, originRule),
					evaluateNode(cache, situation, parsedRules, replacement)
				])
				.filter(
					([originRule, replacement]) =>
						originRule.nodeValue !== replacement.nodeValue ||
						serializeUnit(originRule.unit) !== serializeUnit(replacement.unit)
				)
				.map(([originRule, replacement]) => [
					originRule.dottedName,
					replacement
				])
		)
		// Optimisation : no need for recalcul if situation is the same
		const recalculCache = Object.keys(amendedSituation).length
			? { _meta: { ...cache._meta, inRecalcul: true } } // Create an empty cache
			: cache

		const evaluatedNode = evaluateNode(
			recalculCache,
			{ ...situation, ...amendedSituation },
			parsedRules,
			node.explanation.recalcul
		)

		return {
			...node,
			nodeValue: evaluatedNode.nodeValue,
			...(evaluatedNode.temporalValue && {
				temporalValue: evaluatedNode.temporalValue
			}),
			unit: evaluatedNode.unit,
			explanation: {
				recalcul: evaluatedNode,
				amendedSituation
			}
		}
	}

	const amendedSituation = Object.keys(v.avec).map(dottedName => [
		recurse(dottedName),
		recurse(v.avec[dottedName])
	])
	const defaultRuleToEvaluate = dottedNameContext
	const nodeToEvaluate = recurse(v.règle ?? defaultRuleToEvaluate)
	return {
		explanation: {
			recalcul: nodeToEvaluate,
			amendedSituation
		},
		jsx: Recalcul,
		evaluate
	}
}

export const mecanismSum = (recurse, k, v) => {
	const explanation = v.map(recurse)

	const evaluate = evaluateArray(
		(x, y) => (x === false && y === false ? false : x + y),
		false
	)

	return {
		evaluate,
		jsx: Somme,
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

export const mecanismReduction = (recurse, k, v) => {
	const objectShape = {
		assiette: false,
		abattement: defaultNode(0),
		plafond: defaultNode(Infinity),
		franchise: defaultNode(0)
	}

	const effect = (
		{ assiette, abattement, plafond, franchise, décote },
		cache
	) => {
		const assietteValue = assiette.nodeValue
		if (assietteValue == null) return { nodeValue: null }
		if (assiette.unit) {
			try {
				franchise = convertNodeToUnit(assiette.unit, franchise)
				plafond = convertNodeToUnit(assiette.unit, plafond)
				if (serializeUnit(abattement.unit) !== '%') {
					abattement = convertNodeToUnit(assiette.unit, abattement)
				}
				if (décote) {
					décote.plafond = convertNodeToUnit(assiette.unit, décote.plafond)
					décote.taux = convertNodeToUnit(parseUnit(''), décote.taux)
				}
			} catch (e) {
				typeWarning(
					cache._meta.contextRule,
					"Impossible de convertir les unités de l'allègement entre elles",
					e
				)
			}
		}
		const montantFranchiséDécoté =
			franchise.nodeValue && assietteValue < franchise.nodeValue
				? 0
				: décote
				? (function() {
						const plafondDécote = décote.plafond.nodeValue,
							taux = décote.taux.nodeValue

						return assietteValue > plafondDécote
							? assietteValue
							: max(0, (1 + taux) * assietteValue - taux * plafondDécote)
				  })()
				: assietteValue
		const nodeValue = abattement
			? abattement.nodeValue == null
				? montantFranchiséDécoté === 0
					? 0
					: null
				: serializeUnit(abattement.unit) === '%'
				? max(
						0,
						montantFranchiséDécoté -
							min(
								plafond.nodeValue,
								(abattement.nodeValue / 100) * montantFranchiséDécoté
							)
				  )
				: max(
						0,
						montantFranchiséDécoté -
							min(plafond.nodeValue, abattement.nodeValue)
				  )
			: montantFranchiséDécoté
		return {
			nodeValue,
			unit: assiette.unit,
			explanation: {
				franchise,
				plafond,
				abattement
			}
		}
	}

	const base = parseObject(recurse, objectShape, v),
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

export const mecanismProduct = (recurse, k, v) => {
	if (v.composantes) {
		//mécanisme de composantes. Voir mécanismes.md/composantes
		return decompose(recurse, k, v)
	}
	if (v.variations) {
		return variations(recurse, k, v, true)
	}

	const objectShape = {
		assiette: false,
		taux: defaultNode(1),
		facteur: defaultNode(1),
		plafond: defaultNode(Infinity)
	}
	const effect = ({ assiette, taux, facteur, plafond }, cache) => {
		if (assiette.unit) {
			try {
				plafond = convertNodeToUnit(assiette.unit, plafond)
			} catch (e) {
				typeWarning(
					cache._meta.contextRule,
					"Impossible de convertir l'unité du plafond du produit dans celle de l'assiette",
					e
				)
			}
		}
		const mult = (base, rate, facteur, plafond) =>
			Math.min(base, plafond === false ? Infinity : plafond) * rate * facteur

		let nodeValue = [taux, assiette, facteur].some(n => n.nodeValue === false)
			? false
			: [taux, assiette, facteur].some(n => n.nodeValue === 0)
			? 0
			: [taux, assiette, facteur].some(n => n.nodeValue === null)
			? null
			: mult(
					assiette.nodeValue,
					taux.nodeValue,
					facteur.nodeValue,
					plafond.nodeValue
			  )

		let unit = inferUnit(
			'*',
			[assiette, taux, facteur].map(el => el.unit)
		)
		if (areUnitConvertible(unit, assiette.unit)) {
			nodeValue = convertUnit(unit, assiette.unit, nodeValue)
			unit = assiette.unit
		}
		return {
			nodeValue,
			unit,
			explanation: {
				plafondActif: assiette.nodeValue > plafond.nodeValue
			}
		}
	}

	const explanation = parseObject(recurse, objectShape, v),
		evaluate = evaluateObject(objectShape, effect)

	return {
		evaluate,
		jsx: Product,
		explanation,
		category: 'mecanism',
		name: 'produit',
		type: 'numeric',
		unit: inferUnit(
			'*',
			[explanation.assiette, explanation.taux, explanation.facteur].map(
				el => el.unit
			)
		)
	}
}

export const mecanismMax = (recurse, k, v) => {
	const explanation = v.map(recurse)

	const max = (a, b) => {
		if (a === false) {
			return b
		}
		if (b === false) {
			return a
		}
		if (a === null || b === null) {
			return null
		}
		return Math.max(a, b)
	}
	const evaluate = evaluateArray(max, Number.NEGATIVE_INFINITY)

	const jsx = ({ nodeValue, explanation, unit }) => (
		<Mecanism name="le maximum de" value={nodeValue} unit={unit}>
			<ul>
				{explanation.map((item, i) => (
					<li key={i}>
						<div className="description">{v[i].description}</div>
						{makeJsx(item)}
					</li>
				))}
			</ul>
		</Mecanism>
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

export const mecanismMin = (recurse, k, v) => {
	const explanation = v.map(recurse)

	const evaluate = evaluateArray(min, Infinity)

	const jsx = ({ nodeValue, explanation, unit }) => (
		<Mecanism name="le minimum de" value={nodeValue} unit={unit}>
			<ul>
				{explanation.map((item, i) => (
					<li key={i}>
						<div className="description">{v[i].description}</div>
						{makeJsx(item)}
					</li>
				))}
			</ul>
		</Mecanism>
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

export const mecanismSynchronisation = (recurse, k, v) => {
	const evaluate = (cache, situation, parsedRules, node) => {
		const APIExplanation = evaluateNode(
			cache,
			situation,
			parsedRules,
			node.explanation.API
		)

		const valuePath = v.chemin.split(' . ')

		const nodeValue =
			APIExplanation.nodeValue == null
				? null
				: path(valuePath, APIExplanation.nodeValue)

		// If the API gave a non null value, then some of its props may be null (the API can be composed of multiple API, some failing). Then this prop will be set to the default value defined in the API's rule
		const safeNodeValue =
			nodeValue == null && APIExplanation.nodeValue != null
				? path(valuePath, APIExplanation.explanation.defaultValue)
				: nodeValue

		const missingVariables =
			APIExplanation.nodeValue === null
				? { [APIExplanation.dottedName]: 1 }
				: {}
		const explanation = { ...v, API: APIExplanation }
		return { ...node, nodeValue: safeNodeValue, explanation, missingVariables }
	}

	return {
		explanation: { ...v, API: recurse(v.API) },
		evaluate,
		jsx: function Synchronisation({ explanation }) {
			return (
				<p>
					Obtenu à partir de la saisie{' '}
					<RuleLinkWithContext dottedName={explanation.API.dottedName} />
				</p>
			)
		},
		category: 'mecanism',
		name: 'synchronisation'
	}
}

export const mecanismOnePossibility = dottedName => (recurse, k, v) => ({
	...v,
	'une possibilité': 'oui',
	evaluate: (cache, situation, parsedRules, node) => ({
		...node,
		missingVariables: { [dottedName]: 1 }
	})
})
