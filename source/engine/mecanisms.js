import {
	reduce,
	path,
	mergeWith,
	objOf,
	dissoc,
	add,
	find,
	pluck,
	map,
	any,
	equals,
	is,
	keys,
	evolve,
	curry,
	filter,
	pipe,
	head,
	isEmpty,
	propEq,
	prop,
	has,
	max,
	min,
	subtract,
	sum,
	isNil,
	reject,
	aperture,
	sort,
	toPairs,
	reduced,
	last
} from 'ramda'
import React from 'react'
import { Trans } from 'react-i18next'
import { anyNull, val } from './traverse-common-functions'
import { Node, SimpleRuleLink } from './mecanismViews/common'
import {
	makeJsx,
	evaluateNode,
	rewriteNode,
	evaluateArray,
	evaluateArrayWithFilter,
	evaluateObject,
	parseObject,
	collectNodeMissing,
	mergeAllMissing,
	mergeMissing,
	bonus
} from './evaluation'
import {
	findRuleByName,
	disambiguateRuleReference,
	findRuleByDottedName
} from './rules'

import 'react-virtualized/styles.css'
import Somme from './mecanismViews/Somme'
import Barème from './mecanismViews/Barème'
import BarèmeContinu from './mecanismViews/BarèmeContinu'
import InversionNumérique from './mecanismViews/InversionNumérique'
import Variations from './mecanismViews/Variations'
import Allègement from './mecanismViews/Allègement'
import Composantes from './mecanismViews/Composantes'
import { trancheValue } from './mecanisms/barème'
import buildSelectionView from './mecanismViews/Selection'
import uniroot from './uniroot'

let constantNode = constant => ({
	nodeValue: constant,
	// eslint-disable-next-line
	jsx: nodeValue => <span className="value">{nodeValue}</span>
})

let decompose = (recurse, k, v) => {
	let subProps = dissoc('composantes')(v),
		explanation = v.composantes.map(c => ({
			...recurse(
				objOf(k, {
					...subProps,
					...dissoc('attributs')(c)
				})
			),
			composante: c.nom ? { nom: c.nom } : c.attributs
		}))

	let filter = situationGate => c =>
		!situationGate('sys.filter') ||
		!c.composante ||
		((!c.composante['dû par'] ||
			c.composante['dû par'] == situationGate('sys.filter')) &&
			(!c.composante['impôt sur le revenu'] ||
				c.composante['impôt sur le revenu'] == situationGate('sys.filter')))

	return {
		explanation,
		jsx: Composantes,
		evaluate: evaluateArrayWithFilter(filter, add, 0),
		category: 'mecanism',
		name: 'composantes',
		type: 'numeric'
	}
}

let devariateExplanation = (recurse, mecanismKey, v) => {
	let fixedProps = dissoc('variations')(v),
		explanation = v.variations.map(({ si, alors, sinon }) => ({
			consequence: recurse({
				[mecanismKey]: {
					...fixedProps,
					...(sinon || alors)
				}
			}),
			condition: sinon ? undefined : recurse(si)
		}))

	return explanation
}

/* @devariate = true => This function will produce variations of a same mecanism (e.g. product) that share some common properties */
export let mecanismVariations = (recurse, k, v, devariate) => {
	let explanation = devariate
		? devariateExplanation(recurse, k, v)
		: v.map(({ si, alors, sinon }) =>
				sinon !== undefined
					? { consequence: recurse(sinon), condition: undefined }
					: { consequence: recurse(alors), condition: recurse(si) }
		  )

	let evaluate = (cache, situationGate, parsedRules, node) => {
		let evaluateVariationProp = prop =>
				prop === undefined
					? undefined
					: evaluateNode(cache, situationGate, parsedRules, prop),
			// mark the satisfied variation if any in the explanation
			[, resolvedExplanation] = reduce(
				([resolved, result], variation) => {
					if (resolved) return [true, [...result, variation]]

					// evaluate the condition
					let evaluatedCondition = evaluateVariationProp(variation.condition)

					if (evaluatedCondition == undefined) {
						// We've reached the eventual defaut case
						let evaluatedVariation = {
							consequence: evaluateVariationProp(variation.consequence),
							satisfied: true
						}
						return [true, [...result, evaluatedVariation]]
					}

					if (evaluatedCondition.nodeValue === null)
						// one case has missing variables => we can't go further
						return [true, [...result, { condition: evaluatedCondition }]]

					if (evaluatedCondition.nodeValue === true) {
						let evaluatedVariation = {
							condition: evaluatedCondition,
							consequence: evaluateVariationProp(variation.consequence),
							satisfied: true
						}
						return [true, [...result, evaluatedVariation]]
					}
					return [false, [...result, variation]]
				},
				[false, []]
			)(node.explanation),
			satisfiedVariation = resolvedExplanation.find(v => v.satisfied),
			nodeValue = satisfiedVariation
				? satisfiedVariation.consequence.nodeValue
				: null

		let leftMissing = mergeAllMissing(
				reject(isNil, pluck('condition', resolvedExplanation))
			),
			candidateVariations = filter(
				node => !node.condition || node.condition.nodeValue !== false,
				resolvedExplanation
			),
			rightMissing = mergeAllMissing(
				reject(isNil, pluck('consequence', candidateVariations))
			),
			missingVariables = satisfiedVariation
				? collectNodeMissing(satisfiedVariation.consequence)
				: mergeMissing(bonus(leftMissing), rightMissing)

		return rewriteNode(node, nodeValue, resolvedExplanation, missingVariables)
	}

	// TODO - find an appropriate representation

	return {
		explanation,
		evaluate,
		jsx: Variations,
		category: 'mecanism',
		name: 'variations',
		type: 'numeric'
	}
}

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

		return rewriteNode(node, nodeValue, explanation, missingVariables)
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

		return rewriteNode(node, nodeValue, explanation, missingVariables)
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
		let conditionNode = recurse(condition), // can be a 'comparison', a 'variable', TODO a 'negation'
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
			getFirst = o =>
				pipe(
					head,
					prop(o)
				)(nonFalsyTerms),
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

		return rewriteNode(node, nodeValue, explanation, missingVariables)
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
					parsedRules,
					parsedRules.find(propEq('dottedName', dottedName)),
					i
				)
			)
			.map(name => {
				let userInput = situationGate(name) != undefined
				let rule = findRuleByDottedName(parsedRules, name)
				/* When the fixedObjectiveValue is null, the inversion can't be done : the user needs to set the target's value
				 * But the objectiveRule can also have an 'alternative' property,
				 * which must point to a rule whose value either is set by the user,
				 * or is calculated according to a formula that does not depend on the rule being inversed.
				 * This alternative's value will be used as a target.
				 * */
				let alternativeRule =
					!userInput &&
					rule.alternative &&
					findRuleByDottedName(parsedRules, rule.alternative)
				if (!userInput && !alternativeRule) return null
				return {
					fixedObjectiveRule: rule,
					userInput,
					fixedObjectiveValue: situationGate(name),
					alternativeRule
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
	let { fixedObjectiveValue, fixedObjectiveRule, alternativeRule } = inversion

	let evaluatedAlternative =
		alternativeRule &&
		evaluateNode(oldCache, situationGate, parsedRules, alternativeRule)
	if (evaluatedAlternative && evaluatedAlternative.nodeValue == null)
		return {
			missingVariables: evaluatedAlternative.missingVariables,
			nodeValue: null
		}

	let objectiveValue = evaluatedAlternative
		? evaluatedAlternative.nodeValue
		: fixedObjectiveValue

	let inversionCache = {}
	let fx = x => {
		inversionCache = { parseLevel: oldCache.parseLevel + 1, op: '<' }
		return evaluateNode(
			inversionCache, // with an empty cache
			n => (dottedName === n ? x : situationGate(n)),
			parsedRules,
			fixedObjectiveRule
		)
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
				return y.nodeValue - objectiveValue
			},
			1,
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
		let evaluatedNode = rewriteNode(
			node,
			nodeValue,
			{
				...evolve({ avec: map(recurse) }, v),
				inversedWith: inversion?.inversedWith
			},
			missingVariables
		)
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
		jsx: (nodeValue, explanation) => (
			<Somme nodeValue={nodeValue} explanation={explanation} />
		),
		explanation,
		category: 'mecanism',
		name: 'somme',
		type: 'numeric'
	}
}

export let mecanismReduction = (recurse, k, v) => {
	let objectShape = {
		assiette: false,
		abattement: constantNode(0),
		franchise: constantNode(0)
	}

	let effect = ({ assiette, abattement, franchise, décote }) => {
		let v_assiette = val(assiette)

		if (v_assiette == null) return null

		let montantFranchiséDécoté =
			val(franchise) && v_assiette < val(franchise)
				? 0
				: décote
				? do {
						let plafond = val(décote.plafond),
							taux = val(décote.taux)

						v_assiette > plafond
							? v_assiette
							: max(0, (1 + taux) * v_assiette - taux * plafond)
				  }
				: v_assiette

		return abattement
			? val(abattement) == null
				? montantFranchiséDécoté === 0
					? 0
					: null
				: abattement.category === 'percentage'
				? max(
						0,
						montantFranchiséDécoté - val(abattement) * montantFranchiséDécoté
				  )
				: max(0, montantFranchiséDécoté - val(abattement))
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
		type: 'numeric'
	}
}

export let mecanismProduct = (recurse, k, v) => {
	if (v.composantes) {
		//mécanisme de composantes. Voir known-mecanisms.md/composantes
		return decompose(recurse, k, v)
	}
	if (v.variations) {
		return mecanismVariations(recurse, k, v, true)
	}

	let objectShape = {
		assiette: false,
		taux: constantNode(1),
		facteur: constantNode(1),
		plafond: constantNode(Infinity)
	}
	let effect = ({ assiette, taux, facteur, plafond }) => {
		let mult = (base, rate, facteur, plafond) =>
			Math.min(base, plafond) * rate * facteur
		return val(taux) === 0 ||
			val(taux) === false ||
			val(assiette) === 0 ||
			val(facteur) === 0
			? 0
			: anyNull([taux, assiette, facteur, plafond])
			? null
			: mult(val(assiette), val(taux), val(facteur), val(plafond))
	}

	let explanation = parseObject(recurse, objectShape, v),
		evaluate = evaluateObject(objectShape, effect)

	let jsx = (nodeValue, explanation) => (
		// The rate and factor and threshold are given defaut neutral values. If there is nothing to explain, don't display them at all
		<Node
			classes="mecanism multiplication"
			name="multiplication"
			value={nodeValue}
			child={
				<ul className="properties">
					<li key="assiette">
						<span className="key">
							<Trans>assiette</Trans>:{' '}
						</span>
						<span className="value">{makeJsx(explanation.assiette)}</span>
					</li>
					{explanation.taux.explanation && (
						<li key="taux">
							<span className="key">
								<Trans>taux</Trans>:{' '}
							</span>
							<span className="value">{makeJsx(explanation.taux)}</span>
						</li>
					)}
					{explanation.facteur.explanation && (
						<li key="facteur">
							<span className="key">
								<Trans>facteur</Trans>:{' '}
							</span>
							<span className="value">{makeJsx(explanation.facteur)}</span>
						</li>
					)}
					{explanation.plafond.explanation && (
						<li key="plafond">
							<span className="key">
								<Trans>plafond</Trans>:{' '}
							</span>
							<span className="value">{makeJsx(explanation.plafond)}</span>
						</li>
					)}
				</ul>
			}
		/>
	)

	return {
		evaluate,
		jsx,
		explanation,
		category: 'mecanism',
		name: 'multiplication',
		type: 'numeric'
	}
}

/* on réécrit en une syntaxe plus bas niveau mais plus régulière les tranches :
	`en-dessous de: 1`
	devient
	```
	de: 0
	à: 1
	```
	*/
let desugarScale = recurse => tranches =>
	tranches
		.map(t =>
			has('en-dessous de')(t)
				? { ...t, de: 0, à: t['en-dessous de'] }
				: has('au-dessus de')(t)
				? { ...t, de: t['au-dessus de'], à: Infinity }
				: t
		)
		.map(evolve({ taux: recurse }))

export let mecanismLinearScale = (recurse, k, v) => {
	if (v.composantes) {
		//mécanisme de composantes. Voir known-mecanisms.md/composantes
		return decompose(recurse, k, v)
	}
	if (v.variations) {
		return mecanismVariations(recurse, k, v, true)
	}
	let tranches = desugarScale(recurse)(v['tranches']),
		objectShape = {
			assiette: false
		}

	let effect = ({ assiette, tranches }) => {
		if (val(assiette) === null) return null

		let roundedAssiette = Math.round(val(assiette))

		let matchedTranche = tranches.find(
			({ de: min, à: max }) => roundedAssiette >= min && roundedAssiette <= max
		)

		if (!matchedTranche) return 0
		if (matchedTranche.taux)
			return matchedTranche.taux.nodeValue * val(assiette)
		return matchedTranche.montant
	}

	let explanation = {
			...parseObject(recurse, objectShape, v),
			tranches
		},
		evaluate = evaluateObject(objectShape, effect)

	return {
		evaluate,
		jsx: Barème('linéaire'),
		explanation,
		category: 'mecanism',
		name: 'barème linéaire',
		barème: 'en taux',
		type: 'numeric'
	}
}

export let mecanismScale = (recurse, k, v) => {
	// Sous entendu : barème en taux marginaux.
	if (v.composantes) {
		//mécanisme de composantes. Voir known-mecanisms.md/composantes
		return decompose(recurse, k, v)
	}
	if (v.variations) {
		return mecanismVariations(recurse, k, v, true)
	}

	let tranches = desugarScale(recurse)(v['tranches']),
		objectShape = {
			assiette: false,
			multiplicateur: constantNode(1)
		}

	let effect = ({ assiette, multiplicateur: multiplicateur, tranches }) => {
		let nulled = val(assiette) == null || val(multiplicateur) == null

		return nulled
			? null
			: sum(tranches.map(trancheValue('marginal')(assiette, multiplicateur)))
	}

	let explanation = {
			...parseObject(recurse, objectShape, v),
			tranches
		},
		evaluate = evaluateObject(objectShape, effect)

	return {
		evaluate,
		jsx: Barème('marginal'),
		explanation,
		category: 'mecanism',
		name: 'barème',
		barème: 'en taux marginaux',
		type: 'numeric'
	}
}

export let mecanismContinuousScale = (recurse, k, v) => {
	let objectShape = {
		assiette: false,
		multiplicateur: constantNode(1)
	}
	let effect = ({ assiette, multiplicateur, points }) => {
		if (anyNull([assiette, multiplicateur])) return null
		//We'll build a linear function given the two constraints that must be respected
		let result = pipe(
			toPairs,
			// we don't rely on the sorting of objects
			sort(([k1], [k2]) => k1 - k2),
			points => [...points, [Infinity, last(points)[1]]],
			aperture(2),
			reduce((_, [[lowerLimit, lowerRate], [upperLimit, upperRate]]) => {
				let x1 = val(multiplicateur) * lowerLimit,
					x2 = val(multiplicateur) * upperLimit,
					y1 = val(assiette) * val(recurse(lowerRate)),
					y2 = val(assiette) * val(recurse(upperRate))
				if (val(assiette) > x1 && val(assiette) <= x2) {
					// Outside of these 2 limits, it's a linear function a * x + b
					let a = (y2 - y1) / (x2 - x1),
						b = y1 - x1 * a,
						nodeValue = a * val(assiette) + b,
						taux = nodeValue / val(assiette)
					return reduced({
						nodeValue:
							v['retourne seulement le taux'] === 'oui' ? taux : nodeValue,
						additionalExplanation: {
							seuil: val(assiette) / val(multiplicateur),
							taux
						}
					})
				}
			}, 0)
		)(points)

		return result
	}
	let explanation = {
			...parseObject(recurse, objectShape, v),
			points: v.points
		},
		evaluate = evaluateObject(objectShape, effect)
	return {
		evaluate,
		jsx: BarèmeContinu,
		explanation,
		category: 'mecanism',
		name: 'barème continu',
		type: 'numeric'
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
		name: 'le maximum de'
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
		name: 'le minimum de'
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

export let mecanismSelection = (recurse, k, v) => {
	if (v.composantes) {
		//mécanisme de composantes. Voir known-mecanisms.md/composantes
		return decompose(recurse, k, v)
	}

	let dataSourceName = v['données']
	let dataSearchField = v['dans']
	let dataTargetName = v['renvoie']
	let explanation = recurse(v['cherche'])

	let evaluate = (cache, situationGate, parsedRules, node) => {
		let explanation = evaluateNode(
				cache,
				situationGate,
				parsedRules,
				node.explanation
			),
			dataSource = findRuleByName(parsedRules, dataSourceName),
			data = dataSource ? dataSource['data'] : null,
			dataKey = explanation.nodeValue,
			found =
				data && dataKey && dataSearchField
					? find(item => item[dataSearchField] == dataKey, data)
					: null,
			// return 0 if we found a match for the lookup but not for the specific field,
			// so that component sums don't sum to null
			nodeValue =
				(found &&
					found[dataTargetName] &&
					Number.parseFloat(found[dataTargetName]) / 100) ||
				0,
			missingVariables = explanation.missingVariables

		return rewriteNode(node, nodeValue, explanation, missingVariables)
	}

	let SelectionView = buildSelectionView(dataTargetName)

	return {
		evaluate,
		explanation,
		// eslint-disable-next-line
		jsx: (nodeValue, explanation) => (
			<SelectionView nodeValue={nodeValue} explanation={explanation} />
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

		let nodeValue =
			val(APIExplanation) == null
				? null
				: path(v.chemin.split(' . '))(val(APIExplanation))
		let missingVariables =
			val(APIExplanation) === null ? { [APIExplanation.dottedName]: 1 } : {}
		let explanation = { ...v, API: APIExplanation }
		return rewriteNode(node, nodeValue, explanation, missingVariables)
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
