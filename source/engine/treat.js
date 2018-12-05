import React from 'react'
import { Parser } from 'nearley'
import Grammar from './grammar.ne'
import {
	contains,
	propEq,
	curry,
	cond,
	equals,
	divide,
	multiply,
	map,
	intersection,
	keys,
	propOr,
	always,
	head,
	gte,
	lte,
	lt,
	gt,
	add,
	subtract
} from 'ramda'
import { evaluateNode, rewriteNode, makeJsx, mergeMissing } from './evaluation'
import { Node } from './mecanismViews/common'
import {
	treatVariable,
	treatNegatedVariable,
	treatVariableTransforms
} from './treatVariable'
import { treat } from './traverse'
import knownMecanisms from './known-mecanisms.yaml'
import {
	mecanismOneOf,
	mecanismAllOf,
	mecanismNumericalSwitch,
	mecanismSum,
	mecanismProduct,
	mecanismScale,
	mecanismLinearScale,
	mecanismContinuousScale,
	mecanismMax,
	mecanismMin,
	mecanismError,
	mecanismComplement,
	mecanismSelection,
	mecanismInversion,
	mecanismReduction,
	mecanismVariations,
	mecanismSynchronisation
} from './mecanisms'

let nearley = () => new Parser(Grammar.ParserRules, Grammar.ParserStart)

export let treatString = (rules, rule) => rawNode => {
	/* On a affaire à un string, donc à une expression infixe.
			Elle sera traité avec le parser obtenu grâce à NearleyJs et notre grammaire `grammar.ne`.
			On obtient un objet de type Variable (avec potentiellement un 'modifier', par exemple temporel), CalcExpression ou Comparison.
			Cet objet est alors rebalancé à 'treat'.
			*/

	let [parseResult, ...additionnalResults] = nearley().feed(rawNode).results

	if (
		additionnalResults &&
		additionnalResults.length > 0 &&
		parseResult.category !== 'boolean'
	) {
		// booleans, 'oui' and 'non', have an exceptional resolving precedence
		throw new Error(
			"Attention ! L'expression <" +
				rawNode +
				'> ne peut être traitée de façon univoque'
		)
	}

	if (
		!contains(parseResult.category)([
			'variable',
			'calcExpression',
			'filteredVariable',
			'comparison',
			'negatedVariable',
			'percentage',
			'boolean'
		])
	)
		throw new Error(
			"Attention ! Erreur de traitement de l'expression : " + rawNode
		)

	if (parseResult.category == 'variable')
		return treatVariableTransforms(rules, rule)(parseResult)
	if (parseResult.category == 'negatedVariable')
		return treatNegatedVariable(
			treatVariable(rules, rule)(parseResult.variable)
		)

	if (parseResult.category == 'boolean') {
		return {
			nodeValue: parseResult.nodeValue,
			// eslint-disable-next-line
			jsx: () => <span className="boolean">{rawNode}</span>
		}
	}

	// We don't need to handle category == 'value' because YAML then returns it as
	// numerical value, not a String: it goes to treatNumber
	if (parseResult.category == 'percentage')
		return {
			nodeValue: parseResult.nodeValue,
			category: 'percentage',
			// eslint-disable-next-line
			jsx: () => <span className="value">{rawNode.split('%')[0]} %</span>
			//on ajoute l'espace nécessaire en français avant le pourcentage
		}

	if (
		parseResult.category == 'calcExpression' ||
		parseResult.category == 'comparison'
	) {
		let evaluate = (cache, situation, parsedRules, node) => {
			let operatorFunction = {
					'*': multiply,
					'/': divide,
					'+': add,
					'-': subtract,
					'<': lt,
					'<=': lte,
					'>': gt,
					'>=': gte,
					'=': equals,
					'!=': (a, b) => !equals(a, b)
				}[node.operator],
				explanation = map(
					curry(evaluateNode)(cache, situation, parsedRules),
					node.explanation
				),
				value1 = explanation[0].nodeValue,
				value2 = explanation[1].nodeValue,
				nodeValue =
					value1 == null || value2 == null
						? null
						: operatorFunction(value1, value2),
				missingVariables = mergeMissing(
					explanation[0].missingVariables,
					explanation[1].missingVariables
				)

			return rewriteNode(node, nodeValue, explanation, missingVariables)
		}

		let explanation = parseResult.explanation.map(
				cond([
					[
						propEq('category', 'variable'),
						treatVariableTransforms(rules, rule)
					],
					[
						propEq('category', 'value'),
						node => ({
							nodeValue: node.nodeValue,
							// eslint-disable-next-line
							jsx: nodeValue => <span className="value">{nodeValue}</span>
						})
					],
					[
						propEq('category', 'percentage'),
						node => ({
							nodeValue: node.nodeValue,
							// eslint-disable-next-line
							jsx: nodeValue => (
								<span className="value">{nodeValue * 100}%</span>
							)
							//the best would be to display the original text before parsing, but nearley does'nt let us access it
						})
					]
				])
			),
			operator = parseResult.operator
		let operatorToUnicode = operator =>
			({
				'>=': '≥',
				'<=': '≤',
				'!=': '≠',
				'*': '∗',
				'/': '∕',
				'-': '−'
			}[operator] || operator)
		let jsx = (nodeValue, explanation) => (
			<Node
				classes={'inlineExpression ' + parseResult.category}
				value={nodeValue}
				child={
					<span className="nodeContent">
						<span className="fa fa" />
						{makeJsx(explanation[0])}
						<span className="operator">
							{operatorToUnicode(parseResult.operator)}
						</span>
						{makeJsx(explanation[1])}
					</span>
				}
			/>
		)

		return {
			evaluate,
			jsx,
			operator,
			text: rawNode,
			category: parseResult.category,
			type: parseResult.category == 'calcExpression' ? 'numeric' : 'boolean',
			explanation
		}
	}
}

export let treatNumber = rawNode => ({
	text: '' + rawNode,
	category: 'number',
	nodeValue: rawNode,
	type: 'numeric',
	jsx: <span className="number">{rawNode}</span>
})

export let treatOther = rawNode => {
	throw new Error(
		'Cette donnée : ' + rawNode + ' doit être un Number, String ou Object'
	)
}
export let treatObject = (rules, rule, treatOptions) => rawNode => {
	let mecanisms = intersection(keys(rawNode), keys(knownMecanisms))

	if (mecanisms.length != 1) {
		throw new Error(`OUPS : On ne devrait reconnaître que un et un seul mécanisme dans cet objet
			Objet YAML : ${JSON.stringify(rawNode)}
			Mécanismes implémentés correspondants : ${JSON.stringify(mecanisms)}
			Cette liste doit avoir un et un seul élément.
			Vérifier que le mécanisme est dans l'objet 'dispatch' et dans les'knownMecanisms.yaml'
		`)
	}

	let k = head(mecanisms),
		v = rawNode[k]

	let dispatch = {
			'une de ces conditions': mecanismOneOf,
			'toutes ces conditions': mecanismAllOf,
			'aiguillage numérique': mecanismNumericalSwitch,
			somme: mecanismSum,
			multiplication: mecanismProduct,
			barème: mecanismScale,
			'barème linéaire': mecanismLinearScale,
			'barème continu': mecanismContinuousScale,
			'le maximum de': mecanismMax,
			'le minimum de': mecanismMin,
			complément: mecanismComplement,
			sélection: mecanismSelection,
			'une possibilité': always({
				...v,
				'une possibilité': 'oui',
				missingVariables: { [rule.dottedName]: 1 }
			}),
			inversion: mecanismInversion(rule.dottedName),
			allègement: mecanismReduction,
			variations: mecanismVariations,
			synchronisation: mecanismSynchronisation
		},
		action = propOr(mecanismError, k, dispatch)

	return action(treat(rules, rule, treatOptions), k, v)
}
