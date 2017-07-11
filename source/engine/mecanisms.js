import R from 'ramda'
import React from 'react'
import {anyNull, val} from './traverse-common-functions'
import {Node, Leaf} from './traverse-common-jsx'
import {evaluateNode, collectNodeMissing} from './traverse'

let transformPercentage = s =>
	R.contains('%')(s) ?
		+s.replace('%', '') / 100
	: +s

let evaluateArray = (reducer, start) => (situationGate, parsedRules, node) => {
	let evaluateOne = child => evaluateNode(situationGate, parsedRules, child),
	    explanation = R.map(evaluateOne, node.explanation),
	    values = R.pluck("nodeValue",explanation),
	    nodeValue = R.any(R.equals(null),values) ? null : R.reduce(reducer, start, values)

	let collectMissing = node => R.chain(collectNodeMissing,node.explanation)

	return {
		...node,
		nodeValue,
		collectMissing,
		explanation,
		jsx: {
			...node.jsx,
			value: nodeValue
		}
	}
}

export let decompose = (recurse, k, v) => {
	let
		subProps = R.dissoc('composantes')(v),
		filter = val(recurse("sys . filter")),
		isRelevant = c => !filter || !c.attributs || c.attributs['dû par'] == filter,
		explanation = v.composantes.filter(isRelevant).map(c =>
			({
				... recurse(
					R.objOf(k,
						{
							... subProps,
							... R.dissoc('attributs')(c)
						})
				),
				composante: c.nom ? {nom: c.nom} : c.attributs
			})
		)

	return {
		evaluate: evaluateArray(R.add,0),
		category: 'mecanism',
		name: 'composantes',
		type: 'numeric',
		explanation,
		jsx: <Node
			classes="mecanism composantes"
			name="composantes"
			child={
				<ul>
					{ explanation.map((c, i) =>
						[<li className="composante" key={JSON.stringify(c.composante)}>
							<ul className="composanteAttributes">
								{R.toPairs(c.composante).map(([k,v]) =>
									<li>
										<span>{k}: </span>
										<span>{v}</span>
									</li>
								)}
							</ul>
							<div className="content">
								{c.jsx}
							</div>
						</li>,
						i < (explanation.length - 1) && <li className="composantesSymbol"><i className="fa fa-plus-circle" aria-hidden="true"></i></li>
						]
						)
					}
				</ul>
			}
		/>
	}
}

export let mecanismOneOf = (recurse, k, v) => {
	if (!R.is(Array,v)) throw 'should be array'

	let explanation = R.map(recurse, v)

	return {
		evaluate: evaluateArray(R.or,false),
		explanation,
		category: 'mecanism',
		name: 'une de ces conditions',
		type: 'boolean',
		jsx:	<Node
			classes="mecanism conditions list"
			name='une de ces conditions'
			child={
				<ul>
					{explanation.map(item => <li key={item.name || item.text}>{item.jsx}</li>)}
				</ul>
			}
		/>
	}
}

export let mecanismAllOf = (recurse, k,v) => {
	if (!R.is(Array,v)) throw 'should be array'

	let explanation = R.map(recurse, v)

	return {
		evaluate: evaluateArray(R.and,true),
		explanation,
		category: 'mecanism',
		name: 'toutes ces conditions',
		type: 'boolean',
		jsx:	<Node
			classes="mecanism conditions list"
			name='toutes ces conditions'
			child={
				<ul>
					{explanation.map(item => <li key={item.name || item.text}>{item.jsx}</li>)}
				</ul>
			}
		/>
	}
}

export let mecanismNumericalLogic = (recurse, k,v) => {
	return R.ifElse(
		R.is(String),
		rate => ({ //TODO unifier ce code
			nodeValue: transformPercentage(rate),
			type: 'numeric',
			category: 'percentage',
			percentage: rate,
			explanation: null,
			jsx:
				<span className="percentage" >
					<span className="name">{rate}</span>
				</span>
		}),
		R.pipe(
			R.unless(
				v => R.is(Object)(v) && R.keys(v).length >= 1,
				() => {throw 'Le mécanisme "logique numérique" et ses sous-logiques doivent contenir au moins une proposition'}
			),
			R.toPairs,
			R.reduce( (memo, [condition, consequence]) => {
				let
					{nodeValue, explanation} = memo,
					conditionNode = recurse(condition), // can be a 'comparison', a 'variable', TODO a 'negation'
					childNumericalLogic = mecanismNumericalLogic(recurse, condition, consequence),
					nextNodeValue = conditionNode.nodeValue == null ?
					// Si la proposition n'est pas encore résolvable
						null
					// Si la proposition est résolvable
					:	conditionNode.nodeValue == true ?
						// Si elle est vraie
							childNumericalLogic.nodeValue
						// Si elle est fausse
						: false

				return {...memo,
					nodeValue: nodeValue == null ?
						null
					: nodeValue !== false ?
							nodeValue // l'une des propositions renvoie déjà une valeur numérique donc différente de false
						: nextNodeValue,
					explanation: [...explanation, {
						nodeValue: nextNodeValue,
						category: 'condition',
						text: condition,
						condition: conditionNode,
						conditionValue: conditionNode.nodeValue,
						type: 'boolean',
						explanation: childNumericalLogic,
						jsx: <div className="condition">
							{conditionNode.jsx}
							<div>
								{childNumericalLogic.jsx}
							</div>
						</div>
					}],
				}
			}, {
				nodeValue: false,
				category: 'mecanism',
				name: "logique numérique",
				type: 'boolean || numeric', // lol !
				explanation: []
			}),
			node => ({...node,
				jsx: <Node
					classes="mecanism numericalLogic list"
					name="logique numérique"
					value={node.nodeValue}
					child={
						<ul>
							{node.explanation.map(item => <li key={item.name || item.text}>{item.jsx}</li>)}
						</ul>
					}
				/>
			})
	))(v)
}

export let mecanismPercentage = (recurse,k,v) => {
	let reg = /^(\d+(\.\d+)?)\%$/
	if (R.test(reg)(v))
		return {
			category: 'percentage',
			type: 'numeric',
			percentage: v,
			nodeValue: R.match(reg)(v)[1]/100,
			explanation: null,
			jsx:
				<span className="percentage" >
					<span className="name">{v}</span>
				</span>
		}
	else {
		let node = recurse(v)
		return {
			type: 'numeric',
			category: 'percentage',
			percentage: node.nodeValue,
			nodeValue: node.nodeValue,
			explanation: node,
			jsx: node.jsx
		}
	}
}

export let mecanismSum = (recurse,k,v) => {
	let explanation = v.map(recurse)

	return {
		evaluate: evaluateArray(R.add,0),
		explanation,
		category: 'mecanism',
		name: 'somme',
		type: 'numeric',
		jsx: <Node
			classes="mecanism somme"
			name="somme"
			child={
				<ul>
					{explanation.map(v => <li key={v.name || v.text}>{v.jsx}</li>)}
				</ul>
			}
		/>
	}
}

export let mecanismProduct = (recurse,k,v) => {
	if (v.composantes) { //mécanisme de composantes. Voir known-mecanisms.md/composantes
		return decompose(recurse,k,v)
	}

	let evaluate = (situationGate, parsedRules, node) => {
		let mult = (base, rate, facteur, plafond) => Math.min(base, plafond) * rate * facteur,
			evaluateOne = child => evaluateNode(situationGate, parsedRules, child),
			collectMissing = node => R.chain(collectNodeMissing,R.values(node.explanation))

		let {taux, assiette, facteur, plafond} = node.explanation,
			explanation = R.evolve({
				taux: evaluateOne,
				assiette: evaluateOne,
				facteur: evaluateOne,
				plafond: evaluateOne,
			})(node.explanation)

		let nodeValue = (val(taux) === 0 || val(taux) === false || val(assiette) === 0 || val(facteur) === 0) ?
			0
		: anyNull([taux, assiette, facteur, plafond]) ?
				null
			: mult(val(assiette), val(taux), val(facteur), val(plafond))

		return {
			...node,
			nodeValue,
			collectMissing,
			explanation,
			jsx: {
				...node.jsx,
				value: nodeValue
			}
		}
	}

	let constantNode = constant => ({nodeValue: constant})

	let assiette = recurse(v['assiette']),
		taux = v['taux'] ? recurse({taux: v['taux']}) : constantNode(1),
		facteur = v['facteur'] ? recurse(v['facteur']) : constantNode(1),
		plafond = v['plafond'] ? recurse(v['plafond']) : constantNode(Infinity)

	return {
		evaluate,
		category: 'mecanism',
		name: 'multiplication',
		type: 'numeric',
		explanation: {
			assiette,
			taux,
			facteur,
			plafond
			//TODO introduire 'prorata' ou 'multiplicateur', pour sémantiser les opérandes ?
		},
		jsx: <Node
			classes="mecanism multiplication"
			name="multiplication"
			child={
				<ul className="properties">
					<li key="assiette">
						<span className="key">assiette: </span>
						<span className="value">{assiette.jsx}</span>
					</li>
					{taux.nodeValue != 1 &&
					<li key="taux">
						<span className="key">taux: </span>
						<span className="value">{taux.jsx}</span>
					</li>}
					{facteur.nodeValue != 1 &&
					<li key="facteur">
						<span className="key">facteur: </span>
						<span className="value">{facteur.jsx}</span>
					</li>}
					{plafond.nodeValue != Infinity &&
					<li key="plafond">
						<span className="key">plafond: </span>
						<span className="value">{plafond.jsx}</span>
					</li>}
				</ul>
			}
		/>
	}
}

export let mecanismScale = (recurse,k,v) => {
	// Sous entendu : barème en taux marginaux.
	// A étendre (avec une propriété type ?) quand les règles en contiendront d'autres.
	if (v.composantes) { //mécanisme de composantes. Voir known-mecanisms.md/composantes
		return decompose(recurse,k,v)

	}

	if (v['multiplicateur des tranches'] == null)
		throw "un barème nécessite pour l'instant une propriété 'multiplicateur des tranches'"

	let
		assiette = recurse(v['assiette']),
		multiplicateur = recurse(v['multiplicateur des tranches']),

		/* on réécrit en plus bas niveau les tranches :
		`en-dessous de: 1`
		devient
		```
		de: 0
		à: 1
		```
		*/
		tranches = v['tranches'].map(t =>
			R.has('en-dessous de')(t) ? {de: 0, 'à': t['en-dessous de'], taux: t.taux}
			: R.has('au-dessus de')(t) ? {de: t['au-dessus de'], 'à': Infinity, taux: t.taux}
				: t
		),
		//TODO appliquer retreat() à de, à, taux pour qu'ils puissent contenir des calculs ou pour les cas où toutes les tranches n'ont pas un multiplicateur commun (ex. plafond sécurité sociale). Il faudra alors vérifier leur nullité comme ça :
		/*
			nulled = assiette.nodeValue == null || R.any(
				R.pipe(
					R.values, R.map(val), R.any(R.equals(null))
				)
			)(tranches),
		*/
		// nulled = anyNull([assiette, multiplicateur]),
		nulled = val(assiette) == null || val(multiplicateur) == null,

		nodeValue =
			nulled ?
				null
			: tranches.reduce((memo, {de: min, 'à': max, taux}) =>
				( val(assiette) < ( min * val(multiplicateur) ) )
					? memo + 0
					:	memo
						+ ( Math.min(val(assiette), max * val(multiplicateur)) - (min * val(multiplicateur)) )
						* transformPercentage(taux)
			, 0)

	return {
		nodeValue,
		category: 'mecanism',
		name: 'barème',
		barème: 'en taux marginaux',
		type: 'numeric',
		explanation: {
			assiette,
			multiplicateur,
			tranches
		},
		jsx: <Node
			classes="mecanism barème"
			name="barème"
			value={nodeValue}
			child={
				<ul className="properties">
					<li key="assiette">
						<span className="key">assiette: </span>
						<span className="value">{assiette.jsx}</span>
					</li>
					<li key="multiplicateur">
						<span className="key">multiplicateur des tranches: </span>
						<span className="value">{multiplicateur.jsx}</span>
					</li>
					<table className="tranches">
						<thead>
							<tr>
								<th>Tranches de l'assiette</th>
								<th>Taux</th>
							</tr>
							{v['tranches'].map(({'en-dessous de': maxOnly, 'au-dessus de': minOnly, de: min, 'à': max, taux}) =>
								<tr key={min || minOnly || 0}>
									<td>
										{	maxOnly ? 'En dessous de ' + maxOnly
											: minOnly ? 'Au dessus de ' + minOnly
												: `De ${min} à ${max}` }
									</td>
									<td> {taux} </td>
								</tr>
							)}
						</thead>
					</table>
				</ul>
			}
		/>
	}
}

export let mecanismMax = (recurse,k,v) => {
	let explanation = v.map(recurse)

	return {
		evaluate: evaluateArray(R.max,Number.NEGATIVE_INFINITY),
		type: 'numeric',
		category: 'mecanism',
		name: 'le maximum de',
		explanation,
		jsx: <Node
			classes="mecanism list maximum"
			name="le maximum de"
			child={
				<ul>
				{explanation.map((item, i) =>
					<li key={i}>
						<div className="description">{v[i].description}</div>
						{item.jsx}
					</li>
				)}
				</ul>
			}
		/>
	}
}

export let mecanismComplement = (recurse,k,v) => {
	if (v.composantes) { //mécanisme de composantes. Voir known-mecanisms.md/composantes
		return decompose(recurse,k,v)
	}

	if (v['cible'] == null)
		throw "un complément nécessite une propriété 'cible'"

	let cible = recurse(v['cible']),
		mini = recurse(v['montant']),
		nulled = val(cible) == null,
		nodeValue = nulled ? null : R.subtract(val(mini), R.min(val(cible), val(mini)))

	return {
		type: 'numeric',
		category: 'mecanism',
		name: 'complément pour atteindre',
		nodeValue,
		explanation: {
			cible,
			mini
		},
		jsx: <Node
			classes="mecanism list complement"
			name="complément pour atteindre"
			value={nodeValue}
			child={
				<ul className="properties">
					<li key="cible">
						<span className="key">montant calculé: </span>
						<span className="value">{cible.jsx}</span>
					</li>
					<li key="mini">
						<span className="key">montant à atteindre: </span>
						<span className="value">{mini.jsx}</span>
					</li>
				</ul>
			}
		/>
	}
}

export let mecanismError = (recurse,k,v) => {
	throw "Le mécanisme est inconnu !"
}
