import React from 'react'
import {rules, findRuleByDottedName, disambiguateRuleReference, findRuleByName} from './rules'
import {evaluateVariable} from './variables'
import R from 'ramda'
import knownMecanisms from './known-mecanisms.yaml'
import { Parser } from 'nearley'
import Grammar from './grammar.ne'
import {Node, Leaf} from './traverse-common-jsx'
import {
	mecanismOneOf,mecanismAllOf,mecanismNumericalSwitch,mecanismSum,mecanismProduct,
	mecanismScale,mecanismMax,mecanismMin, mecanismError, mecanismComplement
} from "./mecanisms"
import {evaluateNode, rewriteNode, collectNodeMissing, makeJsx} from './evaluation'

let nearley = () => new Parser(Grammar.ParserRules, Grammar.ParserStart)

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

let fillFilteredVariableNode = (rules, rule) => (filter, parseResult) => {
	let evaluateFiltered = originalEval => (situation, parsedRules, node) => {
		let newSituation = name => name == "sys.filter" ? filter : situation(name)
		return originalEval(newSituation, parsedRules, node)
	}
	let node = fillVariableNode(rules, rule)(parseResult)
	return {
		...node,
		evaluate: evaluateFiltered(node.evaluate)
	}
}

// TODO: dirty, dirty
// ne pas laisser trop longtemps cette "optimisation" qui tue l'aspect fonctionnel de l'algo
var dict;

export let clearDict = () => dict = {}

let fillVariableNode = (rules, rule) => (parseResult) => {
	let evaluate = (situation, parsedRules, node) => {
		let dottedName = node.dottedName,
			// On va vérifier dans le cache courant, dict, si la variable n'a pas été déjà évaluée
			// En effet, l'évaluation dans le cas d'une variable qui a une formule, est coûteuse !
			filter = situation("sys.filter"),
			cacheName = dottedName + (filter ? "." + filter: ""),
			cached = dict[cacheName],
			// make parsedRules a dict object, that also serves as a cache of evaluation ?
			variable = cached ? cached : findRuleByDottedName(parsedRules, dottedName),
			variableIsCalculable = variable.formule != null,

			parsedRule = variableIsCalculable && (cached ? cached : evaluateNode(
				situation,
				parsedRules,
				variable
			)),
			// evaluateVariable renvoit la valeur déduite de la situation courante renseignée par l'utilisateur
			situationValue = evaluateVariable(situation, dottedName, variable),
			nodeValue = situationValue
					!= null ? situationValue // cette variable a été directement renseignée
					: !variableIsCalculable
						? null // pas moyen de calculer car il n'y a pas de formule, elle restera donc nulle
						: parsedRule.nodeValue, // la valeur du calcul fait foi
			explanation = parsedRule,
			missingVariables = variableIsCalculable ? [] : (nodeValue == null ? [dottedName] : [])

			let collectMissing = node =>
				variableIsCalculable ? collectNodeMissing(parsedRule) : node.missingVariables

			let result = cached ? cached : {
				...rewriteNode(node,nodeValue,explanation,collectMissing),
				missingVariables,
			}
			dict[cacheName] = result

			return result
	}

	let {fragments} = parseResult,
		variablePartialName = fragments.join(' . '),
		dottedName = disambiguateRuleReference(rules, rule, variablePartialName)

	let jsx = (nodeValue, explanation) =>
		<Leaf
			classes="variable"
			name={fragments.join(' . ')}
			value={nodeValue}
		/>

	return {
		evaluate,
		jsx,
		name: variablePartialName,
		category: 'variable',
		fragments,
		dottedName,
		type: 'boolean | numeric'
	}
}

let buildNegatedVariable = variable => {
	let evaluate = (situation, parsedRules, node) => {
		let explanation = evaluateNode(situation, parsedRules, node.explanation),
			nodeValue = explanation.nodeValue == null ? null : !explanation.nodeValue
		let collectMissing = node => collectNodeMissing(node.explanation)
		return rewriteNode(node,nodeValue,explanation,collectMissing)
	}

	let jsx = (nodeValue, explanation) =>
		<Node
			classes="inlineExpression negation"
			value={nodeValue}
			child={
				<span className="nodeContent">
					<span className="operator">¬</span>
					{makeJsx(explanation)}
				</span>
			}
		/>

	return {
		evaluate,
		jsx,
		category: 'mecanism',
		name: 'négation',
		type: 'boolean',
		explanation: variable
	}
}

let treat = (rules, rule) => rawNode => {
	// inner functions
	let
		reTreat = treat(rules, rule),
		treatString = rawNode => {
			/* On a affaire à un string, donc à une expression infixe.
			Elle sera traité avec le parser obtenu grâce à NearleyJs et notre grammaire `grammar.ne`.
			On obtient un objet de type Variable (avec potentiellement un 'modifier', par exemple temporel (TODO)), CalcExpression ou Comparison.
			Cet objet est alors rebalancé à 'treat'.
			*/

			let [parseResult, ...additionnalResults] = nearley().feed(rawNode).results

			if (additionnalResults && additionnalResults.length > 0)
				throw "Attention ! L'expression <" + rawNode + '> ne peut être traitée de façon univoque'

			if (!R.contains(parseResult.category)(['variable', 'calcExpression', 'filteredVariable', 'comparison', 'negatedVariable', 'percentage']))
				throw "Attention ! Erreur de traitement de l'expression : " + rawNode

			if (parseResult.category == 'variable')
				return fillVariableNode(rules, rule)(parseResult)
			if (parseResult.category == 'filteredVariable') {
				return fillFilteredVariableNode(rules, rule)(parseResult.filter,parseResult.variable)
			}
			if (parseResult.category == 'negatedVariable')
				return buildNegatedVariable(
					fillVariableNode(rules, rule)(parseResult.variable)
				)

			// We don't need to handle category == 'value' because YAML then returns it as
			// numerical value, not a String: it goes to treatNumber
			if (parseResult.category == 'percentage') {
				return {
					nodeValue: parseFloat(parseResult.nodeValue)/100,
					jsx:  nodeValue => <span className="percentage">{rawNode}</span>
				}
			}

			if (parseResult.category == 'calcExpression' || parseResult.category == 'comparison') {
				let evaluate = (situation, parsedRules, node) => {
					let
						operatorFunctionName = {
							'*': 'multiply',
							'/': 'divide',
							'+': 'add',
							'-': 'subtract',
							'<': 'lt',
							'<=': 'lte',
							'>': 'gt',
							'>=': 'gte'
						}[node.operator],
						explanation = R.map(R.curry(evaluateNode)(situation,parsedRules),node.explanation),
						value1 = explanation[0].nodeValue,
						value2 = explanation[1].nodeValue,
						operatorFunction = R[operatorFunctionName],
						nodeValue = value1 == null || value2 == null ?
							null
						: operatorFunction(value1, value2)

					let collectMissing = node => R.chain(collectNodeMissing,node.explanation)

					return rewriteNode(node,nodeValue,explanation,collectMissing)
				}

				let fillFiltered = parseResult => fillFilteredVariableNode(rules, rule)(parseResult.filter,parseResult.variable)
				let fillVariable = fillVariableNode(rules, rule),
					filledExplanation = parseResult.explanation.map(
						R.cond([
							[R.propEq('category', 'variable'), fillVariable],
							[R.propEq('category', 'filteredVariable'), fillFiltered],
							[R.propEq('category', 'value'), node =>
								({
									nodeValue: parseFloat(node.nodeValue),
									jsx:  nodeValue => <span className="value">{nodeValue}</span>
								})
							],
							[R.propEq('category', 'percentage'), node =>
								({
									nodeValue: parseFloat(node.nodeValue)/100,
									jsx:  nodeValue => <span className="value">{nodeValue}</span>
								})
							]
						])
					),
					operator = parseResult.operator

				let jsx = (nodeValue, explanation) =>
					<Node
						classes={"inlineExpression "+parseResult.category}
						value={nodeValue}
						child={
							<span className="nodeContent">
								{makeJsx(explanation[0])}
								<span className="operator">{parseResult.operator}</span>
								{makeJsx(explanation[1])}
							</span>
						}
					/>

				return {
					evaluate,
					jsx,
					operator,
					text: rawNode,
					category: parseResult.category,
					type: parseResult.category == 'calcExpression' ? 'numeric' : 'boolean',
					explanation: filledExplanation
				}
			}
		},
		treatNumber = rawNode => {
			return {
				text: ""+rawNode,
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

			let dispatch = {
					'une de ces conditions':	mecanismOneOf,
					'toutes ces conditions':	mecanismAllOf,
					'aiguillage numérique':		mecanismNumericalSwitch,
					'somme':					mecanismSum,
					'multiplication':			mecanismProduct,
					'barème':					mecanismScale,
					'le maximum de':			mecanismMax,
					'le minimum de':			mecanismMin,
					'complément':				mecanismComplement,
					'une possibilité':			R.always({})
				},
				action = R.propOr(mecanismError, k, dispatch)

			return action(reTreat,k,v)
		}

	let onNodeType = R.cond([
		[R.is(String),	treatString],
		[R.is(Number),	treatNumber],
		[R.is(Object),	treatObject],
		[R.T,			treatOther]
	])

	let defaultEvaluate = (situationGate, parsedRules, node) => node
	let parsedNode = onNodeType(rawNode)

	return	parsedNode.evaluate ? parsedNode :
			{...parsedNode, evaluate: defaultEvaluate}
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

export let treatRuleRoot = (rules, rule) => {
	let evaluate = (situationGate, parsedRules, r) => {
		let
			evaluated = R.evolve({
				formule: R.curry(evaluateNode)(situationGate, parsedRules),
				"non applicable si": R.curry(evaluateNode)(situationGate, parsedRules)
			},r),
			formuleValue = evaluated.formule && evaluated.formule.nodeValue,
			condition = R.prop('non applicable si',evaluated),
			condValue = condition && condition.nodeValue,
			nodeValue = computeRuleValue(formuleValue, condValue)

		return {...evaluated, nodeValue}
	}
	let collectMissing = node => {
		let cond = R.prop('non applicable si',node),
			condMissing = cond ? collectNodeMissing(cond) : [],
			collectInFormule = (cond && cond.nodeValue != undefined) ? !cond.nodeValue : true,
			formule = node.formule,
			formMissing = collectInFormule ? (formule ? collectNodeMissing(formule) : []) : []
		return R.concat(condMissing,formMissing)
	}

	let parsedRoot = R.evolve({ // Voilà les attributs d'une règle qui sont aujourd'hui dynamiques, donc à traiter

	// Les métadonnées d'une règle n'en font pas aujourd'hui partie

	// condition d'applicabilité de la règle
		'non applicable si': value => {
			let evaluate = (situationGate, parsedRules, node) => {
				let collectMissing = node => collectNodeMissing(node.explanation)
				let explanation = evaluateNode(situationGate, parsedRules, node.explanation),
					nodeValue = explanation.nodeValue
				return rewriteNode(node,nodeValue,explanation,collectMissing)
			}

			let child = treat(rules, rule)(value)

			let jsx = (nodeValue, explanation) =>
				<Node
					classes="ruleProp mecanism cond"
					name="non applicable si"
					value={nodeValue}
					child={
						explanation.category === 'variable' ? <div className="node">{makeJsx(explanation)}</div>
						: makeJsx(explanation)
					}
				/>

			return {
				evaluate,
				jsx,
				category: 'ruleProp',
				rulePropType: 'cond',
				name: 'non applicable si',
				type: 'boolean',
				explanation: child
			}
		}
		,
		'formule': value => {
			let evaluate = (situationGate, parsedRules, node) => {
				let collectMissing = node => collectNodeMissing(node.explanation)
				let explanation = evaluateNode(situationGate, parsedRules, node.explanation),
					nodeValue = explanation.nodeValue
				return rewriteNode(node,nodeValue,explanation,collectMissing)
			}

			let child = treat(rules, rule)(value)

			let jsx = (nodeValue, explanation) =>
				<Node
					classes="ruleProp mecanism formula"
					name="formule"
					value={nodeValue}
					child={makeJsx(explanation)}
				/>

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
	,

	})(rule)

	return {
		// Pas de propriété explanation et jsx ici car on est parti du (mauvais) principe que 'non applicable si' et 'formule' sont particuliers, alors qu'ils pourraient être rangé avec les autres mécanismes
		...parsedRoot,
		evaluate,
		collectMissing
	}
}


export let analyseSituation = (rules, rootVariable) => situationGate => {
	let {root, parsedRules} = analyseTopDown(rules,rootVariable)(situationGate)
	return root
}



export let analyseTopDown = (rules, rootVariable) => situationGate => {
	clearDict()
	let
		/*
		La fonction treatRuleRoot va descendre l'arbre de la règle `rule` et produire un AST, un objet contenant d'autres objets contenant d'autres objets...
		Aujourd'hui, une règle peut avoir (comme propriétés à parser) `non applicable si` et `formule`,
		qui ont elles-mêmes des propriétés de type mécanisme (ex. barème) ou des expressions en ligne (ex. maVariable + 3).
		Ces mécanismes où variables sont descendues à leur tour grâce à `treat()`.
		Lors de ce traitement, des fonctions 'evaluate', `collectMissingVariables` et `jsx` sont attachés aux objets de l'AST
		*/
		treatOne = rule => treatRuleRoot(rules, rule),

		//On fait ainsi pour chaque règle de la base.
		parsedRules = R.map(treatOne,rules),
		rootRule = findRuleByName(parsedRules, rootVariable),

		/*
			Ce n'est que dans cette nouvelle étape que l'arbre est vraiment évalué.
			Auparavant, l'évaluation était faite lors de la construction de l'AST.
		*/
		root = evaluateNode(situationGate, parsedRules, rootRule)

	return {
		root,
		parsedRules
	}
}
