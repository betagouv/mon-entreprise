// This should be the new way to implement mecanisms
// In a specific file
// TODO import them automatically
// TODO convert the legacy functions to new files
import barème from 'Engine/mecanisms/barème.js'
import { Parser } from 'nearley'
import {
	add,
	always,
	cond,
	contains,
	curry,
	divide,
	equals,
	gt,
	gte,
	head,
	intersection,
	keys,
	lt,
	lte,
	map,
	multiply,
	propEq,
	propOr,
	subtract
} from 'ramda'
import React from 'react'
import { evaluateNode, makeJsx, mergeMissing, rewriteNode } from './evaluation'
import Grammar from './grammar.ne'
import knownMecanisms from './known-mecanisms.yaml'
import {
	mecanismAllOf,
	mecanismComplement,
	mecanismContinuousScale,
	mecanismError,
	mecanismInversion,
	mecanismLinearScale,
	mecanismMax,
	mecanismMin,
	mecanismNumericalSwitch,
	mecanismOneOf,
	mecanismProduct,
	mecanismReduction,
	mecanismSum,
	mecanismSynchronisation,
	mecanismVariations
} from './mecanisms'
import { Node } from './mecanismViews/common'
import { treat } from './traverse'
import {
	treatNegatedVariable,
	treatVariable,
	treatVariableTransforms
} from './treatVariable'

export let nearley = () => new Parser(Grammar.ParserRules, Grammar.ParserStart)

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

	if (parseResult.category == 'variable')
		return treatVariableTransforms(rules, rule)(parseResult)
	if (parseResult.category == 'negatedVariable')
		return treatNegatedVariable(
			treatVariable(rules, rule)(parseResult.variable)
		)

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
			barème,
			'barème linéaire': mecanismLinearScale,
			'barème continu': mecanismContinuousScale,
			'le maximum de': mecanismMax,
			'le minimum de': mecanismMin,
			complément: mecanismComplement,
			'une possibilité': always({
				...v,
				'une possibilité': 'oui',
				missingVariables: { [rule.dottedName]: 1 }
			}),
			'inversion numérique': mecanismInversion(rule.dottedName),
			allègement: mecanismReduction,
			variations: mecanismVariations,
			synchronisation: mecanismSynchronisation
		},
		action = propOr(mecanismError, k, dispatch)

	return action(treat(rules, rule, treatOptions), k, v)
}
