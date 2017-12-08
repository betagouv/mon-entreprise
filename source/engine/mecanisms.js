import R from 'ramda'
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
	collectNodeMissing
} from './evaluation'
import {
	findRuleByName,
	disambiguateRuleReference,
	findRuleByDottedName
} from './rules'

import 'react-virtualized/styles.css'
import { Table, Column } from 'react-virtualized'
import taux_versement_transport from 'Règles/rémunération-travail/cotisations/ok/liste-taux.json'
import Somme from './mecanismViews/Somme'
import uniroot from './uniroot'
import {clearDict} from 'Engine/traverse'


let constantNode = constant => ({
	nodeValue: constant,
	jsx: nodeValue => <span className="value">{nodeValue}</span>
})

let decompose = (recurse, k, v) => {
	let subProps = R.dissoc('composantes')(v),
		explanation = v.composantes.map(c => ({
			...recurse(
				R.objOf(k, {
					...subProps,
					...R.dissoc('attributs')(c)
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
								{R.toPairs(c.composante).map(([k, v]) => (
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
		evaluate: evaluateArrayWithFilter(filter, R.add, 0),
		category: 'mecanism',
		name: 'composantes',
		type: 'numeric'
	}
}

let devariate = (recurse, k, v) => {
	let subProps = R.dissoc('variations')(v),
		explanation = v.variations.map(c => ({
			...recurse(
				R.objOf(k, {
					...subProps,
					...R.dissoc('si')(c)
				})
			),
			condition: recurse(c.si)
		}))

	let evaluate = (situationGate, parsedRules, node) => {
		let evaluateOne = child => {
			let condition = evaluateNode(situationGate, parsedRules, child.condition)
			return {
				...evaluateNode(situationGate, parsedRules, child),
				condition
			}
		}

		let explanation = R.map(evaluateOne, node.explanation),
			choice = R.find(node => node.condition.nodeValue, explanation),
			nodeValue = choice ? choice.nodeValue : null

		let collectMissing = node => {
			let choice = R.find(node => node.condition.nodeValue, node.explanation),
				leftMissing = choice
					? []
					: R.uniq(
						R.chain(
							collectNodeMissing,
							R.pluck('condition', node.explanation)
						)
					),
				rightMissing = choice
					? collectNodeMissing(choice)
					: R.chain(collectNodeMissing, node.explanation)
			return R.concat(leftMissing, rightMissing)
		}

		return rewriteNode(node, nodeValue, explanation, collectMissing)
	}

	// TODO - find an appropriate representation
	let jsx = (nodeValue, explanation) => (
		<Node
			classes="mecanism variations"
			name="variations"
			value={nodeValue}
			child={
				<ul>
					{explanation.map((c) => [
						<li className="variation" key={JSON.stringify(c.variation)}>
							<div className="condition">
								{makeJsx(c.condition)}
								<div className="content">{makeJsx(c)}</div>
							</div>
						</li>
					])}
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
	if (!R.is(Array, v)) throw 'should be array'

	let explanation = R.map(recurse, v)

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

	let evaluate = (situationGate, parsedRules, node) => {
		let evaluateOne = child => evaluateNode(situationGate, parsedRules, child),
			explanation = R.map(evaluateOne, node.explanation),
			values = R.pluck('nodeValue', explanation),
			nodeValue = R.any(R.equals(true), values)
				? true
				: R.any(R.equals(null), values) ? null : false

		let collectMissing = node =>
			node.nodeValue == null
				? R.chain(collectNodeMissing, node.explanation)
				: []
		return rewriteNode(node, nodeValue, explanation, collectMissing)
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
	if (!R.is(Array, v)) throw 'should be array'

	let explanation = R.map(recurse, v)

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


	let evaluate = (situationGate, parsedRules, node) => {
		let evaluateOne = child => evaluateNode(situationGate, parsedRules, child),
			explanation = R.map(evaluateOne, node.explanation),
			values = R.pluck('nodeValue', explanation),
			nodeValue = R.any(R.equals(false), values)
				? false // court-circuit
				: R.any(R.equals(null), values) ? null : true

		let collectMissing = node =>
			node.nodeValue == null
				? R.chain(collectNodeMissing, node.explanation)
				: []
		return rewriteNode(node, nodeValue, explanation, collectMissing)
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
	if (R.is(String, v)) return recurse(v)

	if (!R.is(Object, v) || R.keys(v).length == 0) {
		throw 'Le mécanisme "aiguillage numérique" et ses sous-logiques doivent contenir au moins une proposition'
	}

	// les termes sont les couples (condition, conséquence) de l'aiguillage numérique
	let terms = R.toPairs(v)

	// la conséquence peut être un 'string' ou un autre aiguillage numérique
	let parseCondition = ([condition, consequence]) => {
		let conditionNode = recurse(condition), // can be a 'comparison', a 'variable', TODO a 'negation'
			consequenceNode = mecanismNumericalSwitch(recurse, condition, consequence)

		let evaluate = (situationGate, parsedRules, node) => {
			let collectMissing = node => {
				let missingOnTheLeft = collectNodeMissing(node.explanation.condition),
					investigate = node.explanation.condition.nodeValue !== false,
					missingOnTheRight = investigate
						? collectNodeMissing(node.explanation.consequence)
						: []
				return R.concat(missingOnTheLeft, missingOnTheRight)
			}

			let explanation = R.evolve(
				{
					condition: R.curry(evaluateNode)(situationGate, parsedRules),
					consequence: R.curry(evaluateNode)(situationGate, parsedRules)
				},
				node.explanation
			)

			return {
				...node,
				collectMissing,
				explanation,
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

	let evaluateTerms = (situationGate, parsedRules, node) => {
		let evaluateOne = child => evaluateNode(situationGate, parsedRules, child),
			explanation = R.map(evaluateOne, node.explanation),
			nonFalsyTerms = R.filter(node => node.condValue !== false, explanation),
			getFirst = prop => R.pipe(R.head, R.prop(prop))(nonFalsyTerms),
			nodeValue =
				// voilà le "numérique" dans le nom de ce mécanisme : il renvoie zéro si aucune condition n'est vérifiée
				R.isEmpty(nonFalsyTerms)
					? 0
					: // c'est un 'null', on renvoie null car des variables sont manquantes
					getFirst('condValue') == null
						? null
						: // c'est un true, on renvoie la valeur de la conséquence
						getFirst('nodeValue')

		let collectMissing = node => {
			let choice = R.find(node => node.condValue, node.explanation)
			return choice
				? collectNodeMissing(choice)
				: R.chain(collectNodeMissing, node.explanation)
		}

		return rewriteNode(node, nodeValue, explanation, collectMissing)
	}

	let explanation = R.map(parseCondition, terms)

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
		throw 'Une formule d\'inversion doit préciser _avec_ quoi on peut inverser la variable'
	/*
	Quelle variable d'inversion possible a sa valeur renseignée dans la situation courante ?
	Ex. s'il nous est demandé de calculer le salaire de base, est-ce qu'un candidat à l'inversion, comme
	le salaire net, a été renseigné ?
	*/
	let fixedObjective = inversions
		.map(i => disambiguateRuleReference(rules, rules.find(R.propEq('dottedName', dottedName)), i))
		.find(name => situationGate(name) != undefined)

	if (fixedObjective == null) return {inversionChoiceNeeded: true}
	//par exemple, fixedObjective = 'salaire net', et v('salaire net') == 2000
	return {
		fixedObjective,
		fixedObjectiveValue: situationGate(fixedObjective),
		fixedObjectiveRule: findRuleByDottedName(rules, fixedObjective)
	}
}


let doInversion = (situationGate, parsedRules, v, dottedName) => {
	let inversion = findInversion(situationGate, parsedRules, v, dottedName)

	if (inversion.inversionChoiceNeeded) return {
		inversionMissingVariables: [dottedName],
		nodeValue: null
	}
	let { fixedObjectiveValue, fixedObjectiveRule } = inversion
	let fx = x =>
		clearDict() && evaluateNode(
			n => dottedName === n ? x : situationGate(n),
			parsedRules,
			fixedObjectiveRule
		).nodeValue

	// si fx renvoie null pour une valeur numérique standard, disons 1000, on peut
	// considérer que l'inversion est impossible du fait de variables manquantes
	// TODO fx peut être null pour certains x, et valide pour d'autres : on peut implémenter ici le court-circuit
	if (fx(1000) == null)
		return {
			nodeValue: null,
			inversionMissingVariables: collectNodeMissing(
				evaluateNode(
					n =>
						dottedName === n ? 1000 : situationGate(n),
					parsedRules,
					fixedObjectiveRule
				)
			)
		}

	let tolerancePercentage = 0.00001,
		// cette fonction détermine la racine d'une fonction sans faire trop d'itérations
		nodeValue = uniroot(
			x => fx(x) - fixedObjectiveValue,
			0,
			1000000000,
			tolerancePercentage * fixedObjectiveValue,
			100
		)

	return {
		nodeValue,
		inversionMissingVariables: []
	}
}


export let mecanismInversion = dottedName => (recurse, k, v) => {

	let evaluate = (situationGate, parsedRules, node) => {
		let inversion =
			// avoid the inversion loop !
			situationGate(dottedName) == undefined &&
			doInversion(situationGate, parsedRules, v, dottedName)
		let
			collectMissing = () => inversion.inversionMissingVariables,
			nodeValue = inversion.nodeValue

		return rewriteNode(node, nodeValue, null, collectMissing)
	}

	return {
		evaluate,
		jsx: (nodeValue) => (
			<Node
				classes="mecanism inversion"
				name="inversion"
				value={nodeValue}
				child={<div>
					<div>avec</div>
					<ul>{v.avec.map(recurse).map(el => <li key={el.name}>{makeJsx(el)}</li>)}</ul>
				</div>} />
		),
		category: 'mecanism',
		name: 'inversion',
		type: 'numeric'
	}
}

export let mecanismSum = (recurse, k, v) => {
	let explanation = v.map(recurse)

	let evaluate = evaluateArray(R.add, 0)

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

	/* on réécrit en plus bas niveau les tranches :
	`en-dessous de: 1`
	devient
	```
	de: 0
	à: 1
	```
	*/
	let tranches = v['tranches'].map(
		t =>
			R.has('en-dessous de')(t)
				? { de: 0, à: t['en-dessous de'], taux: t.taux }
				: R.has('au-dessus de')(t)
					? { de: t['au-dessus de'], à: Infinity, taux: t.taux }
					: t
	).map(R.evolve({taux: recurse}))

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
			nulled = assiette.nodeValue == null || R.any(
				R.pipe(
					R.values, R.map(val), R.any(R.equals(null))
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
										}}
									>
										<td>
											{maxOnly
												? 'En dessous de ' + maxOnly
												: minOnly
													? 'Au dessus de ' + minOnly
													: `De ${min} à ${max}`}
										</td>
										<td> {taux} </td>
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

	let evaluate = evaluateArray(R.max, Number.NEGATIVE_INFINITY)

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

	let evaluate = evaluateArray(R.min, Infinity)

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
		return nulled
			? null
			: R.subtract(val(montant), R.min(val(cible), val(montant)))
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

	let evaluate = (situationGate, parsedRules, node) => {
		let collectMissing = node => collectNodeMissing(node.explanation),
			explanation = evaluateNode(situationGate, parsedRules, node.explanation),
			dataSource = findRuleByName(parsedRules, dataSourceName),
			data = dataSource ? dataSource['data'] : null,
			dataKey = explanation.nodeValue,
			dataItems =
				data && dataKey && dataSearchField
					? R.filter(item => item[dataSearchField] == dataKey, data)
					: null,
			dataItemValues =
				dataItems && !R.isEmpty(dataItems) ? R.values(dataItems) : null,
			// TODO - over-specific! transform the JSON instead
			dataItemSubValues =
				dataItemValues && dataItemValues[0][dataTargetName]
					? dataItemValues[0][dataTargetName]['taux']
					: null,
			sortedSubValues = dataItemSubValues
				? R.sortBy(pair => pair[0], R.toPairs(dataItemSubValues))
				: null,
			// return 0 if we found a match for the lookup but not for the specific field,
			// so that component sums don't sum to null
			nodeValue = dataItems
				? sortedSubValues
					? Number.parseFloat(R.last(sortedSubValues)[1]) / 100
					: 0
				: null
		return rewriteNode(node, nodeValue, explanation, collectMissing)
	}

	let indexOf = explanation =>
		explanation.nodeValue
			? R.findIndex(
				x => x['nomLaposte'] == explanation.nodeValue,
				taux_versement_transport
			)
			: 0
	let indexOffset = 8

	let jsx = (nodeValue, explanation) => (
		<Node
			classes="mecanism"
			name="sélection"
			value={nodeValue}
			child={
				<Table
					width={300}
					height={300}
					headerHeight={20}
					rowHeight={30}
					rowCount={taux_versement_transport.length}
					scrollToIndex={indexOf(explanation) + indexOffset}
					rowStyle={({ index }) =>
						index == indexOf(explanation) ? { fontWeight: 'bold' } : {}}
					rowGetter={({ index }) => {
						// transformation de données un peu crade du fichier taux.json qui gagnerait à être un CSV
						let line = taux_versement_transport[index],
							getLastTaux = dataTargetName => {
								let lastTaux = R.values(R.path([dataTargetName, 'taux'], line))
								return (lastTaux && lastTaux.length && lastTaux[0]) || 0
							}
						return {
							nom: line['nomLaposte'],
							taux: getLastTaux(dataTargetName)
						}
					}}
				>
					<Column label="Nom de commune" dataKey="nom" width={200} />
					<Column width={100} label={'Taux ' + dataTargetName} dataKey="taux" />
				</Table>
			}
		/>
	)

	return {
		evaluate,
		explanation,
		jsx
	}
}

export let mecanismError = (recurse, k, v) => {
	throw 'Le mécanisme \'' + k + '\' est inconnu !' + v
}
