import React from 'react'
import {rules, findRuleByDottedName, disambiguateRuleReference, findRuleByName} from './rules'
import {evaluateVariable} from './variables'
import R from 'ramda'
import knownMecanisms from './known-mecanisms.yaml'
import { Parser } from 'nearley'
import Grammar from './grammar.ne'
import {Node, Leaf} from './traverse-common-jsx'
import {anyNull, val} from './traverse-common-functions'


let nearley = () => new Parser(Grammar.ParserRules, Grammar.ParserStart)

/*
 Dans ce fichier, les règles YAML sont parsées.
 Elles expriment un langage orienté expression, les expressions étant
 - préfixes quand elles sont des 'mécanismes' (des mot-clefs représentant des calculs courants dans la loi)
 - infixes pour les feuilles : des tests d'égalité, d'inclusion, des comparaisons sur des variables ou tout simplement la  variable elle-même, ou une opération effectuée sur la variable

*/


let transformPercentage = s =>
	R.contains('%')(s) ?
		+s.replace('%', '') / 100
	: +s


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

let fillVariableNode = (rules, rule, situationGate) => (parseResult) => {
	let
		{fragments} = parseResult,
		variablePartialName = fragments.join(' . '),
		dottedName = disambiguateRuleReference(rules, rule, variablePartialName),
		variable = findRuleByDottedName(rules, dottedName),
		variableIsCalculable = variable.formule != null,
		//TODO perf : mettre un cache sur les variables !
		// On le fait pas pour l'instant car ça peut compliquer les fonctionnalités futures
		// et qu'il n'y a aucun problème de perf aujourd'hui
		parsedRule = variableIsCalculable && treatRuleRoot(
			situationGate,
			rules,
			variable
		),

		situationValue = evaluateVariable(situationGate, dottedName, variable),
		nodeValue = situationValue
			!= null ? situationValue
			: !variableIsCalculable
				? null
				: parsedRule.nodeValue,
		explanation = parsedRule,
		missingVariables = variableIsCalculable ? [] : (nodeValue == null ? [dottedName] : [])

	return {
		nodeValue,
		category: 'variable',
		fragments: fragments,
		dottedName,
		type: 'boolean | numeric',
		explanation: parsedRule,
		missingVariables,
		jsx:	<Leaf
			classes="variable"
			name={fragments.join(' . ')}
			value={nodeValue}
		/>
	}
}


let buildNegatedVariable = variable => {
	let nodeValue = variable.nodeValue == null ? null : !variable.nodeValue
	return {
		nodeValue,
		category: 'mecanism',
		name: 'négation',
		type: 'boolean',
		explanation: variable,
		jsx:	<Node
			classes="inlineExpression negation"
			value={nodeValue}
			child={
				<span className="nodeContent">
					<span className="operator">¬</span>
					{variable.jsx}
				</span>
			}
		/>
	}
}

let treat = (situationGate, rules, rule) => rawNode => {
	// inner functions
	let reTreat = treat(situationGate, rules, rule),
		treatString = rawNode => {
			/* On a à faire à un string, donc à une expression infixe.
			Elle sera traité avec le parser obtenu grâce à NearleyJs et notre grammaire.
			On obtient un objet de type Variable (avec potentiellement un 'modifier', par exemple temporel (TODO)), CalcExpression ou Comparison.
			Cet objet est alors rebalancé à 'treat'.
			*/

			let [parseResult, ...additionnalResults] = nearley().feed(rawNode).results

			if (additionnalResults && additionnalResults.length > 0)
				throw "Attention ! L'expression <" + rawNode + '> ne peut être traitée de façon univoque'

			if (!R.contains(parseResult.category)(['variable', 'calcExpression', 'modifiedVariable', 'comparison', 'negatedVariable']))
				throw "Attention ! Erreur de traitement de l'expression : " + rawNode

			if (parseResult.category == 'variable')
				return fillVariableNode(rules, rule, situationGate)(parseResult)
			if (parseResult.category == 'negatedVariable')
				return buildNegatedVariable(
					fillVariableNode(rules, rule, situationGate)(parseResult.variable)
				)

			if (parseResult.category == 'calcExpression') {
				let
					filledExplanation = parseResult.explanation.map(
						R.cond([
							[R.propEq('category', 'variable'), fillVariableNode(rules, rule, situationGate)],
							[R.propEq('category', 'value'), node =>
								R.assoc('jsx', <span className="value">
									{node.nodeValue}
								</span>)(node)
							]
						])
					),
					[{nodeValue: value1}, {nodeValue: value2}] = filledExplanation,
					operatorFunctionName = {
						'*': 'multiply',
						'/': 'divide',
						'+': 'add',
						'-': 'subtract'
					}[parseResult.operator],
					operatorFunction = R[operatorFunctionName],
					nodeValue = value1 == null || value2 == null ?
						null
					: operatorFunction(value1, value2)

				return {
					text: rawNode,
					nodeValue,
					category: 'calcExpression',
					type: 'numeric',
					explanation: filledExplanation,
					jsx:	<Node
						classes="inlineExpression calcExpression"
						value={nodeValue}
						child={
							<span className="nodeContent">
								{filledExplanation[0].jsx}
								<span className="operator">{parseResult.operator}</span>
								{filledExplanation[1].jsx}
							</span>
						}
					/>
				}
			}
			if (parseResult.category == 'comparison') {
				//TODO mutualise code for 'comparison' & 'calclExpression'. Harmonise their names
				let
					filledExplanation = parseResult.explanation.map(
						R.cond([
							[R.propEq('category', 'variable'), fillVariableNode(rules, rule, situationGate)],
							[R.propEq('category', 'value'), node =>
								R.assoc('jsx', <span className="value">
									{node.nodeValue}
								</span>)(node)
							]
						])
					),
					[{nodeValue: value1}, {nodeValue: value2}] = filledExplanation,
					comparatorFunctionName = {
						'<': 'lt',
						'<=': 'lte',
						'>': 'gt',
						'>=': 'gte'
						//TODO '='
					}[parseResult.operator],
					comparatorFunction = R[comparatorFunctionName],
					nodeValue = value1 == null || value2 == null ?
						null
					: comparatorFunction(value1, value2)

				return {
					text: rawNode,
					nodeValue: nodeValue,
					category: 'comparison',
					type: 'boolean',
					explanation: filledExplanation,
					jsx:	<Node
						classes="inlineExpression comparison"
						value={nodeValue}
						child={
							<span className="nodeContent">
								{filledExplanation[0].jsx}
								<span className="operator">{parseResult.operator}</span>
								{filledExplanation[1].jsx}
							</span>
						}
					/>
				}
			}
		},
		treatNumber = rawNode => {
			return {
				category: 'number',
				nodeValue: rawNode,
				type: 'numeric',
				jsx:
					<span className="number">
						{rawNode}
					</span>
			}
		},
		treatOther = rawNode => {
			console.log() // eslint-disable-line no-console
			throw 'Cette donnée : ' + rawNode + ' doit être un Number, String ou Object'
		},
		treatObject = rawNode => {
			let mecanisms = R.intersection(R.keys(rawNode), R.keys(knownMecanisms))

			if (mecanisms.length != 1) {
				console.log('Erreur : On ne devrait reconnaître que un et un seul mécanisme dans cet objet', rawNode)
				throw 'OUPS !'
			}

			let k = R.head(mecanisms),
				v = rawNode[k]

			if (k === 'une de ces conditions') {
				let result = R.pipe(
					R.unless(R.is(Array), () => {throw 'should be array'}),
					R.reduce( (memo, next) => {
						let {nodeValue, explanation} = memo,
							child = reTreat(next),
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
			if (k === 'toutes ces conditions') {
				return R.pipe(
					R.unless(R.is(Array), () => {throw 'should be array'}),
					R.reduce( (memo, next) => {
						let {nodeValue, explanation} = memo,
							child = reTreat(next),
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

			//TODO perf: declare this closure somewhere else ?
			let treatNumericalLogicRec =
				R.ifElse(
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
								conditionNode = reTreat(condition), // can be a 'comparison', a 'variable', TODO a 'negation'
								childNumericalLogic = treatNumericalLogicRec(consequence),
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
										{node.explanation.map(item => <li key={item.name}>{item.jsx}</li>)}
									</ul>
								}
							/>
						})
				))

			if (k === 'logique numérique') {
				return treatNumericalLogicRec(v)
			}

			if (k === 'taux') {
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
					let node = reTreat(v)
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

			// Une simple somme de variables
			if (k === 'somme') {
				let
					summedVariables = v.map(reTreat),
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
								{summedVariables.map(v => <li key={v.name}>{v.jsx}</li>)}
							</ul>
						}
					/>
				}
			}

			if (k === 'multiplication') {
				let
					mult = (base, rate, facteur, plafond) =>
						Math.min(base, plafond) * rate * facteur,
					constantNode = constant => ({nodeValue: constant}),
					assiette = reTreat(v['assiette']),
					//TODO parser le taux dans le parser ?
					taux = v['taux'] ? reTreat({taux: v['taux']}) : constantNode(1),
					facteur = v['facteur'] ? reTreat(v['facteur']) : constantNode(1),
					plafond = v['plafond'] ? reTreat(v['plafond']) : constantNode(Infinity),
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

			if (k === 'barème') {
				// Sous entendu : barème en taux marginaux.
				// A étendre (avec une propriété type ?) quand les règles en contiendront d'autres.
				if (v.composantes) { //mécanisme de composantes. Voir known-mecanisms.md/composantes
					let
						baremeProps = R.dissoc('composantes')(v),
						composantes = v.composantes.map(c =>
							({
								... reTreat(
									{
										barème: {
											... baremeProps,
											... R.dissoc('attributs')(c)
										}
									}
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

				if (v['multiplicateur des tranches'] == null)
					throw "un barème nécessite pour l'instant une propriété 'multiplicateur des tranches'"

				let
					assiette = reTreat(v['assiette']),
					multiplicateur = reTreat(v['multiplicateur des tranches']),

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
											<tr key={min || minOnly}>
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

			if (k === 'le maximum de') {
				let contenders = v.map(treat(situationGate, rules, rule)),
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

			throw "Le mécanisme est inconnu !"
		}

	let onNodeType = R.cond([
		[R.is(String),	treatString],
		[R.is(Number),	treatNumber],
		[R.is(Object),	treatObject],
		[R.T,			treatOther]
	])
	return onNodeType(rawNode)
}

//TODO c'est moche :
export let computeRuleValue = (formuleValue, condValue) =>
	condValue === undefined
	? formuleValue
	: formuleValue === 0
	? 0
	: condValue === null
		? null
		: condValue === true
			? 0
			: formuleValue

export let treatRuleRoot = (situationGate, rules, rule) => R.pipe(
	R.evolve({ // -> Voilà les attributs que peut comporter, pour l'instant, une Variable.

	// 'meta': pas de traitement pour l'instant

	// 'cond' : Conditions d'applicabilité de la règle
		'non applicable si': value => {
			let
				child = treat(situationGate, rules, rule)(value),
				nodeValue = child.nodeValue

			return {
				category: 'ruleProp',
				rulePropType: 'cond',
				name: 'non applicable si',
				type: 'boolean',
				nodeValue: child.nodeValue,
				explanation: child,
				jsx: <Node
					classes="ruleProp mecanism cond"
					name="non applicable si"
					value={nodeValue}
					child={
						child.category === 'variable' ? <div className="node">{child.jsx}</div>
						: child.jsx
					}
				/>
			}
		}
		,
		// [n'importe quel mécanisme booléen] : expression booléenne (simple variable, négation, égalité, comparaison numérique, test d'inclusion court / long) || l'une de ces conditions || toutes ces conditions
		// 'applicable si': // pareil mais inversé !

		// note: pour certaines variables booléennes, ex. appartenance à régime Alsace-Moselle, la formule et le non applicable si se rejoignent
		// [n'importe quel mécanisme numérique] : multiplication || barème en taux marginaux || le maximum de || le minimum de || ...
		'formule': value => {
			let
				child = treat(situationGate, rules, rule)(value),
				nodeValue = child.nodeValue
			return {
				category: 'ruleProp',
				rulePropType: 'formula',
				name: 'formule',
				type: 'numeric',
				nodeValue: nodeValue,
				explanation: child,
				shortCircuit: R.pathEq(['non applicable si', 'nodeValue'], true),
				jsx: <Node
					classes="ruleProp mecanism formula"
					name="formule"
					value={nodeValue}
					child={
						child.jsx
					}
				/>
			}
		}
	,
	// TODO les mécanismes de composantes et de variations utilisables un peu partout !
	// TODO 'temporal': information concernant les périodes : à définir !
	// TODO 'intéractions': certaines variables vont en modifier d'autres : ex. Fillon va réduire voir annuler (set 0) une liste de cotisations
	// ... ?

	}),
	/* Calcul de la valeur de la variable en combinant :
	- les conditions d'application ('non applicable si')
	- la formule

	TODO: mettre les conditions d'application dans "formule", et traiter la formule comme un mécanisme normal dans treat()

	*/
	r => {
		let
			formuleValue = r.formule.nodeValue,
			condValue = R.path(['non applicable si', 'nodeValue'])(r),
			nodeValue = computeRuleValue(formuleValue, condValue)

		return {...r, nodeValue}
	}
)(rule)


/* Analyse the set of selected rules, and add derived information to them :
- do they need variables that are not present in the user situation ?
- if not, do they have a computed value or are they non applicable ?
*/

export let analyseSituation = (rules, rootVariable) => situationGate =>
	treatRuleRoot(
		situationGate,
		rules,
		findRuleByName(rules, rootVariable)
	)








/*--------------------------------------------------------------------------------
 Ce qui suit est la première tentative d'écriture du principe du moteur et de la syntaxe */

// let types = {
	/*
	(expression):
		| (variable)
		| (négation)
		| (égalité)
		| (comparaison numérique)
		| (test d'inclusion court)
	*/

// }


/*
Variable:
	- applicable si: (boolean logic)
	- non applicable si: (boolean logic)
	- concerne: (expression)
	- ne concerne pas: (expression)

(boolean logic):
	toutes ces conditions: ([expression | boolean logic])
	une de ces conditions: ([expression | boolean logic])
	conditions exclusives: ([expression | boolean logic])

"If you write a regular expression, walk away for a cup of coffee, come back, and can't easily understand what you just wrote, then you should look for a clearer way to express what you're doing."

Les expressions sont le seul mécanisme relativement embêtant pour le moteur. Dans un premier temps, il les gerera au moyen d'expressions régulières, puis il faudra probablement mieux s'équiper avec un "javascript parser generator" :
https://medium.com/@daffl/beyond-regex-writing-a-parser-in-javascript-8c9ed10576a6

(variable): (string)

(négation):
	! (variable)

(égalité):
	(variable) = (variable.type)

(comparaison numérique):
	| (variable) < (variable.type)
	| (variable) <= (variable.type)
	| (variable) > (variable.type)
	| (variable) <= (variable.type)

(test d'inclusion court):
	(variable) ⊂ [variable.type]

in Variable.formule :
	- composantes
	- linéaire
	- barème en taux marginaux
	- test d'inclusion: (test d'inclusion)

(test d'inclusion):
	variable: (variable)
	possibilités: [variable.type]

# pas nécessaire pour le CDD

	in Variable
		- variations: [si]

	(si):
		si: (expression)
		# corps

	*/
