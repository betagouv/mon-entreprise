import R from 'ramda'
import React from 'react'
import {anyNull, val} from './traverse-common-functions'
import {Node, Leaf} from './traverse-common-jsx'

let transformPercentage = s =>
	R.contains('%')(s) ?
		+s.replace('%', '') / 100
	: +s

export let decompose = (recurse, k, v) => {
	let
		subProps = R.dissoc('composantes')(v),
		filter = val(recurse("sys . filter")),
		isRelevant = c => !filter || !c.attributs || c.attributs['dû par'] == filter,
		composantes = v.composantes.filter(isRelevant).map(c =>
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
		),
		nodeValue = anyNull(composantes) ? null
			: R.reduce(R.add, 0, composantes.map(val))

	return {
		nodeValue,
		category: 'mecanism',
		name: 'composantes',
		type: 'numeric',
		explanation: composantes,
		jsx: <Node
			classes="mecanism composantes"
			name="composantes"
			value={nodeValue}
			child={
				<ul>
					{ composantes.map((c, i) =>
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
						i < (composantes.length - 1) && <li className="composantesSymbol"><i className="fa fa-plus-circle" aria-hidden="true"></i></li>
						]
						)
					}
				</ul>
			}
		/>
	}
}

export let mecanismOneOf = (recurse, k, v) => {
	let result = R.pipe(
		R.unless(R.is(Array), () => {throw 'should be array'}),
		R.reduce( (memo, next) => {
			let {nodeValue, explanation} = memo,
				child = recurse(next),
				{nodeValue: nextValue} = child
			return {...memo,
				// c'est un OU logique mais avec une préférence pour null sur false
				nodeValue: nodeValue || nextValue || (
					nodeValue == null ? null : nextValue
				),
				explanation: [...explanation, child]
			}
		}, {
			nodeValue: false,
			category: 'mecanism',
			name: 'une de ces conditions',
			type: 'boolean',
			explanation: []
		}) // Reduce but don't use R.reduced to set the nodeValue : we need to treat all the nodes
	)(v)
	return {...result,
		jsx:	<Node
			classes="mecanism conditions list"
			name={result.name}
			value={result.nodeValue}
			child={
				<ul>
					{result.explanation.map(item => <li key={item.name || item.text}>{item.jsx}</li>)}
				</ul>
			}
		/>
	}
}

export let mecanismAllOf = (recurse, k,v) => {
	return R.pipe(
		R.unless(R.is(Array), () => {throw 'should be array'}),
		R.reduce( (memo, next) => {
			let {nodeValue, explanation} = memo,
				child = recurse(next),
				{nodeValue: nextValue} = child
			return {...memo,
				// c'est un ET logique avec une possibilité de null
				nodeValue: ! nodeValue ? nodeValue : nextValue,
				explanation: [...explanation, child]
			}
		}, {
			nodeValue: true,
			category: 'mecanism',
			name: 'toutes ces conditions',
			type: 'boolean',
			explanation: []
		}) // Reduce but don't use R.reduced to set the nodeValue : we need to treat all the nodes
	)(v)
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
	// Si c'est une liste historisée de pourcentages
	// TODO revoir le test avant le bug de l'an 2100
	else if ( R.is(Array)(v) && R.all(R.test(/(19|20)\d\d(-\d\d)?(-\d\d)?/))(R.keys(v)) ) {
		//TODO sélectionner la date de la simulation en cours
		let lazySelection = R.first(R.values(v))
		return {
			category: 'percentage',
			type: 'numeric',
			percentage: lazySelection,
			nodeValue: transformPercentage(lazySelection),
			explanation: null,
			jsx:
				<span className="percentage" >
					<span className="name">{lazySelection}</span>
				</span>
		}
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
	let
		summedVariables = v.map(recurse),
		nodeValue = summedVariables.reduce(
			(memo, {nodeValue: nextNodeValue}) => memo == null ? null : nextNodeValue == null ? null : memo + +nextNodeValue,
		0)

	return {
		nodeValue,
		category: 'mecanism',
		name: 'somme',
		type: 'numeric',
		explanation: summedVariables,
		jsx: <Node
			classes="mecanism somme"
			name="somme"
			value={nodeValue}
			child={
				<ul>
					{summedVariables.map(v => <li key={v.name || v.text}>{v.jsx}</li>)}
				</ul>
			}
		/>
	}
}

export let mecanismProduct = (recurse,k,v) => {
	if (v.composantes) { //mécanisme de composantes. Voir known-mecanisms.md/composantes
		return decompose(recurse,k,v)
	}

	let
		mult = (base, rate, facteur, plafond) =>
			Math.min(base, plafond) * rate * facteur,
		constantNode = constant => ({nodeValue: constant}),
		assiette = recurse(v['assiette']),
		//TODO parser le taux dans le parser ?
		taux = v['taux'] ? recurse({taux: v['taux']}) : constantNode(1),
		facteur = v['facteur'] ? recurse(v['facteur']) : constantNode(1),
		plafond = v['plafond'] ? recurse(v['plafond']) : constantNode(Infinity),
		//TODO rate == false should be more explicit
		nodeValue = (val(taux) === 0 || val(taux) === false || val(assiette) === 0 || val(facteur) === 0) ?
			0
		: anyNull([taux, assiette, facteur, plafond]) ?
				null
			: mult(val(assiette), val(taux), val(facteur), val(plafond))
	return {
		nodeValue,
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
			value={nodeValue}
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
	let contenders = v.map(recurse),
		contenderValues = R.pluck('nodeValue')(contenders),
		stopEverything = R.contains(null, contenderValues),
		maxValue = R.max(...contenderValues),
		nodeValue = stopEverything ? null : maxValue

	return {
		type: 'numeric',
		category: 'mecanism',
		name: 'le maximum de',
		nodeValue,
		explanation: contenders,
		jsx: <Node
			classes="mecanism list maximum"
			name="le maximum de"
			value={nodeValue}
			child={
				<ul>
				{contenders.map((item, i) =>
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

export let mecanismError = (recurse,k,v) => {
	throw "Le mécanisme est inconnu !"
}
