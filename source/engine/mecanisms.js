import {
	reduce,
	mergeWith,
	sort,
	objOf,
	toPairs,
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
	values,
	sortBy,
	last
} from 'ramda'
import React from 'react'
import { anyNull, val } from './traverse-common-functions'
import { Node } from './mecanismViews/common'
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
import Allègement from './mecanismViews/Allègement'
import buildSelectionView from './mecanismViews/Selection'
import uniroot from './uniroot'

let constantNode = constant => ({
	nodeValue: constant,
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

	let jsx = (nodeValue, explanation) => (
		<Node
			classes="mecanism composantes"
			name="composantes"
			value={nodeValue}
			child={
				<ul>
					{explanation.map((c, i) => [
						<li className="composante" key={JSON.stringify(c.composante)}>
							<ul className="composanteAttributes">
								{toPairs(c.composante).map(([k, v]) => (
									<li key={k}>
										<span>{k}: </span>
										<span>{v}</span>
									</li>
								))}
							</ul>
							<div className="content">{makeJsx(c)}</div>
						</li>,
						i < explanation.length - 1 && (
							<li key="+" className="composantesSymbol">
								<i className="fa fa-plus-circle" aria-hidden="true" />
							</li>
						)
					])}
				</ul>
			}
		/>
	)

	let filter = situationGate => c =>
		!situationGate('sys.filter') ||
		!c.composante ||
		!c.composante['dû par'] ||
		c.composante['dû par'] == situationGate('sys.filter')

	return {
		explanation,
		jsx,
		evaluate: evaluateArrayWithFilter(filter, add, 0),
		category: 'mecanism',
		name: 'composantes',
		type: 'numeric'
	}
}

let devariate = (recurse, k, v) => {
	let subProps = dissoc('variations')(v),
		explanation = v.variations.map(c => ({
			...recurse(
				objOf(k, {
					...subProps,
					...dissoc('si')(c)
				})
			),
			condition: recurse(c.si)
		}))

	let evaluate = (cache, situationGate, parsedRules, node) => {
		let evaluateOne = child => {
			let condition = evaluateNode(
				cache,
				situationGate,
				parsedRules,
				child.condition
			)
			return {
				...evaluateNode(cache, situationGate, parsedRules, child),
				condition
			}
		}

		let explanation = map(evaluateOne, node.explanation),
			candidates = filter(
				node => node.condition.nodeValue !== false,
				explanation
			),
			satisfied = filter(node => node.condition.nodeValue, explanation),
			choice = head(satisfied),
			nodeValue = choice ? choice.nodeValue : null

		let leftMissing = choice
				? {}
				: mergeAllMissing(pluck('condition', explanation)),
			rightMissing = mergeAllMissing(candidates),
			missingVariables = mergeMissing(bonus(leftMissing), rightMissing)

		return rewriteNode(node, nodeValue, explanation, missingVariables)
	}

	// TODO - find an appropriate representation
	let jsx = (nodeValue, explanation) => (
		<Node
			classes="mecanism variations"
			name="variations"
			value={nodeValue}
			child={
				<ul>
					{explanation.map(c => (
						<li className="variation" key={JSON.stringify(c.condition)}>
							<div className="condition">
								{makeJsx(c.condition)}
								<div className="content">{makeJsx(c)}</div>
							</div>
						</li>
					))}
				</ul>
			}
		/>
	)

	return {
		explanation,
		evaluate,
		jsx,
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

export let findInversion = (situationGate, rules, v, dottedName) => {
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
	let fixedObjective = inversions
		.map(i =>
			disambiguateRuleReference(
				rules,
				rules.find(propEq('dottedName', dottedName)),
				i
			)
		)
		.find(name => situationGate(name) != undefined)

	if (fixedObjective == null) return { inversionChoiceNeeded: true }
	//par exemple, fixedObjective = 'salaire net', et v('salaire net') == 2000
	return {
		fixedObjective,
		fixedObjectiveValue: situationGate(fixedObjective),
		fixedObjectiveRule: findRuleByDottedName(rules, fixedObjective)
	}
}

let doInversion = (oldCache, situationGate, parsedRules, v, dottedName) => {
	let inversion = findInversion(situationGate, parsedRules, v, dottedName)

	if (inversion.inversionChoiceNeeded)
		return {
			missingVariables: { [dottedName]: 1 },
			nodeValue: null
		}
	let { fixedObjectiveValue, fixedObjectiveRule } = inversion
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

	let tolerancePercentage = 0.00001,
		// cette fonction détermine la racine d'une fonction sans faire trop d'itérations
		nodeValue = uniroot(
			x => fx(x).nodeValue - fixedObjectiveValue,
			0,
			1000000000,
			tolerancePercentage * fixedObjectiveValue,
			100
		)

	return {
		nodeValue,
		missingVariables: {},
		inversionCache
	}
}

export let mecanismInversion = dottedName => (recurse, k, v) => {
	let evaluate = (cache, situationGate, parsedRules, node) => {
		let inversion =
				// avoid the inversion loop !
				situationGate(dottedName) == undefined &&
				doInversion(cache, situationGate, parsedRules, v, dottedName),
			nodeValue = inversion.nodeValue,
			missingVariables = inversion.missingVariables

		let evaluatedNode = rewriteNode(node, nodeValue, null, missingVariables)

		// TODO - we need this so that ResultsGrid will work, but it's
		// just not right
		toPairs(inversion.inversionCache).map(([k, v]) => (cache[k] = v))
		return evaluatedNode
	}

	return {
		...v,
		evaluate,
		jsx: nodeValue => (
			<Node
				classes="mecanism inversion"
				name="inversion"
				value={nodeValue}
				child={
					<div>
						<div>avec</div>
						<ul>
							{v.avec
								.map(recurse)
								.map(el => <li key={el.name}>{makeJsx(el)}</li>)}
						</ul>
					</div>
				}
			/>
		),
		category: 'mecanism',
		name: 'inversion',
		type: 'numeric'
	}
}

export let mecanismSum = (recurse, k, v) => {
	let explanation = v.map(recurse)

	let evaluate = evaluateArray(add, 0)

	return {
		evaluate,
		jsx: (nodeValue, explanation) => (
			<Somme nodeValue={nodeValue} explanation={explanation} />
		),
		explanation,
		category: 'mecanism',
		name: 'somme',
		type: 'numeric'
	}
}

export let mecanismLinearReduction = (recurse, k, v) => {
	let objectShape = {
		assiette: false,
		variable: false,
		multiplicateur: false
	}

	let effect = ({ assiette, variable, multiplicateur, contraintes }) => {
		let nulled = anyNull([assiette, variable, multiplicateur])

		if (nulled) return null

		//We'll build a linear function given the two constraints that must be respected

		let contraintesList = pipe(
				toPairs,
				// we don't rely on the sorting of objects
				sort(([k1], [k2]) => k1 - k2)
			)(contraintes),
			[lowerLimit, lowerRate] = head(contraintesList),
			[upperLimit, upperRate] = last(contraintesList),
			x1 = val(multiplicateur) * lowerLimit,
			x2 = val(multiplicateur) * upperLimit,
			y1 = val(assiette) * lowerRate,
			y2 = val(assiette) * upperRate

		if (val(variable) < x1) return y1
		if (val(variable) > x2) return y2

		// Outside of these 2 limits, it's a linear function a * x + b

		let a = (y2 - y1) / (x2 - x1),
			b = y1 - x1 * a

		return a * val(variable) + b
	}

	let explanation = {
			...parseObject(recurse, objectShape, v),
			contraintes: v.contraintes
		},
		evaluate = evaluateObject(objectShape, effect)

	let jsx = (nodeValue, explanation) => (
		<Node
			classes="mecanism réductionLinéaire"
			name="réductionLinéaire"
			value={nodeValue}
			child={<div> Réduction linéaire </div>}
		/>
	)

	return {
		evaluate,
		jsx,
		explanation,
		category: 'mecanism',
		name: 'réduction linéaire',
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
		return devariate(recurse, k, v)
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
		<Node
			classes="mecanism multiplication"
			name="multiplication"
			value={nodeValue}
			child={
				<ul className="properties">
					<li key="assiette">
						<span className="key">assiette: </span>
						<span className="value">{makeJsx(explanation.assiette)}</span>
					</li>
					{(explanation.taux.nodeValue != 1 ||
						explanation.taux.category == 'calcExpression') && (
						<li key="taux">
							<span className="key">taux: </span>
							<span className="value">{makeJsx(explanation.taux)}</span>
						</li>
					)}
					{(explanation.facteur.nodeValue != 1 ||
						explanation.taux.category == 'calcExpression') && (
						<li key="facteur">
							<span className="key">facteur: </span>
							<span className="value">{makeJsx(explanation.facteur)}</span>
						</li>
					)}
					{explanation.plafond.nodeValue != Infinity && (
						<li key="plafond">
							<span className="key">plafond: </span>
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

export let mecanismScale = (recurse, k, v) => {
	// Sous entendu : barème en taux marginaux.
	// A étendre (avec une propriété type ?) quand les règles en contiendront d'autres.
	if (v.composantes) {
		//mécanisme de composantes. Voir known-mecanisms.md/composantes
		return decompose(recurse, k, v)
	}
	if (v.variations) {
		return devariate(recurse, k, v)
	}

	/* on réécrit en une syntaxe plus bas niveau mais plus régulière les tranches :
	`en-dessous de: 1`
	devient
	```
	de: 0
	à: 1
	```
	*/
	let tranches = v['tranches']
		.map(
			t =>
				has('en-dessous de')(t)
					? { de: 0, à: t['en-dessous de'], taux: t.taux }
					: has('au-dessus de')(t)
						? { de: t['au-dessus de'], à: Infinity, taux: t.taux }
						: t
		)
		.map(evolve({ taux: recurse }))

	let objectShape = {
		assiette: false,
		'multiplicateur des tranches': constantNode(1)
	}

	let effect = ({
		assiette,
		'multiplicateur des tranches': multiplicateur,
		tranches
	}) => {
		// TODO traiter la récursion 'de', 'à', 'taux' pour qu'ils puissent contenir des calculs
		// ou pour les cas où toutes les tranches n'ont pas un multiplicateur commun (ex. plafond
		// sécurité sociale). Il faudra alors vérifier leur nullité comme ça :
		/*
			nulled = assiette.nodeValue == null || any(
				pipe(
					values, map(val), any(equals(null))
				)
			)(tranches),
		*/
		// nulled = anyNull([assiette, multiplicateur]),
		let nulled = val(assiette) == null || val(multiplicateur) == null

		return nulled
			? null
			: tranches.reduce(
					(memo, { de: min, à: max, taux }) =>
						val(assiette) < min * val(multiplicateur)
							? memo + 0
							: memo +
							  (Math.min(val(assiette), max * val(multiplicateur)) -
									min * val(multiplicateur)) *
									taux.nodeValue,
					0
			  )
	}

	let explanation = {
			...parseObject(recurse, objectShape, v),
			tranches
		},
		evaluate = evaluateObject(objectShape, effect)

	let jsx = (nodeValue, explanation) => (
		<Node
			classes="mecanism barème"
			name="barème"
			value={nodeValue}
			child={
				<ul className="properties">
					<li key="assiette">
						<span className="key">assiette: </span>
						<span className="value">{makeJsx(explanation.assiette)}</span>
					</li>
					<li key="multiplicateur">
						<span className="key">multiplicateur des tranches: </span>
						<span className="value">
							{makeJsx(explanation['multiplicateur des tranches'])}
						</span>
					</li>
					<table className="tranches">
						<thead>
							<tr>
								<th>Tranches de l'assiette</th>
								<th>Taux</th>
							</tr>
							{explanation.tranches.map(
								({
									'en-dessous de': maxOnly,
									'au-dessus de': minOnly,
									de: min,
									à: max,
									taux
								}) => (
									<tr
										key={min || minOnly || 0}
										style={{
											fontWeight:
												explanation.assiette.nodeValue *
													explanation['multiplicateur des tranches'].nodeValue >
												min
													? ' bold'
													: ''
										}}>
										<td key="tranche">
											{maxOnly
												? 'En dessous de ' + maxOnly
												: minOnly
													? 'Au dessus de ' + minOnly
													: `De ${min} à ${max}`}
										</td>
										<td key="taux"> {makeJsx(taux)} </td>
									</tr>
								)
							)}
						</thead>
					</table>
				</ul>
			}
		/>
	)

	return {
		evaluate,
		jsx,
		explanation,
		category: 'mecanism',
		name: 'barème',
		barème: 'en taux marginaux',
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
		jsx: (nodeValue, explanation) => (
			<Node
				classes="mecanism list complement"
				name="complément"
				value={nodeValue}
				child={
					<ul className="properties">
						<li key="cible">
							<span className="key">cible: </span>
							<span className="value">{makeJsx(explanation.cible)}</span>
						</li>
						<li key="mini">
							<span className="key">montant à atteindre: </span>
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
			dataItems =
				data && dataKey && dataSearchField
					? filter(item => item[dataSearchField] == dataKey, data)
					: null,
			dataItemValues =
				dataItems && !isEmpty(dataItems) ? values(dataItems) : null,
			// TODO - over-specific! transform the JSON instead
			dataItemSubValues =
				dataItemValues && dataItemValues[0][dataTargetName]
					? dataItemValues[0][dataTargetName]['taux']
					: null,
			sortedSubValues = dataItemSubValues
				? sortBy(pair => pair[0], toPairs(dataItemSubValues))
				: null,
			// return 0 if we found a match for the lookup but not for the specific field,
			// so that component sums don't sum to null
			nodeValue = dataItems
				? sortedSubValues
					? Number.parseFloat(last(sortedSubValues)[1]) / 100
					: 0
				: null,
			missingVariables = explanation.missingVariables

		return rewriteNode(node, nodeValue, explanation, missingVariables)
	}

	let SelectionView = buildSelectionView(dataTargetName)

	return {
		evaluate,
		explanation,
		jsx: (nodeValue, explanation) => (
			<SelectionView nodeValue={nodeValue} explanation={explanation} />
		)
	}
}

export let mecanismError = (recurse, k, v) => {
	throw new Error("Le mécanisme '" + k + "' est inconnu !" + v)
}
