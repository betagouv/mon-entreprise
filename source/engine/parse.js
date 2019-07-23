// This should be the new way to implement mecanisms
// In a specific file
// TODO import them automatically
// TODO convert the legacy functions to new files
import barème from 'Engine/mecanisms/barème'
import barèmeContinu from 'Engine/mecanisms/barème-continu'
import barèmeLinéaire from 'Engine/mecanisms/barème-linéaire'
import variations from 'Engine/mecanisms/variations'
import operation from 'Engine/mecanisms/operation'
import { Parser } from 'nearley'

import {
	add,
	divide,
	equals,
	gt,
	gte,
	keys,
	without,
	lt,
	lte,
	multiply,
	propOr,
	subtract,
	fromPairs,
	is,
	cond,
	T
} from 'ramda'
import React from 'react'
import Grammar from './grammar.ne'
import {
	mecanismAllOf,
	mecanismComplement,
	mecanismError,
	mecanismInversion,
	mecanismMax,
	mecanismMin,
	mecanismNumericalSwitch,
	mecanismOneOf,
	mecanismProduct,
	mecanismReduction,
	mecanismSum,
	mecanismSynchronisation,
	mecanismOnePossibility
} from './mecanisms'
import { parseReferenceTransforms } from './parseReference'

export let parse = (rules, rule, parsedRules) => rawNode => {
	let onNodeType = cond([
		[is(String), parseString(rules, rule, parsedRules)],
		[is(Number), parseNumber],
		[is(Object), parseObject(rules, rule, parsedRules)],
		[T, parseOther]
	])

	let defaultEvaluate = (cache, situationGate, parsedRules, node) => node
	let parsedNode = onNodeType(rawNode)

	return parsedNode.evaluate
		? parsedNode
		: { ...parsedNode, evaluate: defaultEvaluate }
}

export let nearley = () => new Parser(Grammar.ParserRules, Grammar.ParserStart)

export let parseString = (rules, rule, parsedRules) => rawNode => {
	/* Strings correspond to infix expressions.
	 * Indeed, a subset of expressions like simple arithmetic operations `3 + (quantity * 2)` or like `salary [month]` are more explicit that their prefixed counterparts.
	 * This function makes them prefixed operations. */

	let [parseResult] = nearley().feed(rawNode).results

	return parseObject(rules, rule, parsedRules)(parseResult)
}

export let parseNumber = rawNode => ({
	text: '' + rawNode,
	category: 'number',
	nodeValue: rawNode,
	type: 'numeric',
	jsx: <span className="number">{rawNode}</span>
})

export let parseOther = rawNode => {
	throw new Error(
		'Cette donnée : ' + rawNode + ' doit être un Number, String ou Object'
	)
}

export let parseObject = (rules, rule, parsedRules) => rawNode => {
	/* TODO instead of describing mecanisms in knownMecanisms.yaml, externalize the mecanisms themselves in an individual file and describe it
	let mecanisms = intersection(keys(rawNode), keys(knownMecanisms))

	if (mecanisms.length != 1) {
	} 
	*/

	let attributes = keys(rawNode),
		descriptiveAttributes = ['description', 'note', 'référence'],
		relevantAttributes = without(descriptiveAttributes, attributes)
	if (relevantAttributes.length !== 1)
		throw new Error(`OUPS : On ne devrait reconnaître que un et un seul mécanisme dans cet objet (au-delà des attributs descriptifs tels que "description", "commentaire", etc.)
			Objet YAML : ${JSON.stringify(rawNode)}
			Cette liste doit avoir un et un seul élément.
			Si vous venez tout juste d'ajouter un nouveau mécanisme, vérifier qu'il est bien intégré dans le dispatch de parse.js
		`)
	let k = relevantAttributes[0],
		v = rawNode[k]

	let knownOperations = {
			'*': [multiply, '∗'],
			'/': [divide, '∕'],
			'+': [add],
			'-': [subtract, '−'],
			'<': [lt],
			'<=': [lte, '≤'],
			'>': [gt],
			'>=': [gte, '≥'],
			'=': [equals],
			'!=': [(a, b) => !equals(a, b), '≠']
		},
		operationDispatch = fromPairs(
			Object.entries(knownOperations).map(([k, [f, symbol]]) => [
				k,
				operation(k, f, symbol)
			])
		)

	let dispatch = {
			'une de ces conditions': mecanismOneOf,
			'toutes ces conditions': mecanismAllOf,
			'aiguillage numérique': mecanismNumericalSwitch,
			somme: mecanismSum,
			multiplication: mecanismProduct,
			barème,
			'barème linéaire': barèmeLinéaire,
			'barème continu': barèmeContinu,
			'le maximum de': mecanismMax,
			'le minimum de': mecanismMin,
			complément: mecanismComplement,
			'une possibilité': mecanismOnePossibility(rule.dottedName),
			'inversion numérique': mecanismInversion(rule.dottedName),
			allègement: mecanismReduction,
			variations,
			synchronisation: mecanismSynchronisation,
			...operationDispatch,
			filter: () =>
				parseReferenceTransforms(rules, rule, parsedRules)({
					filter: v.filter,
					variable: v.explanation
				}),
			variable: () =>
				parseReferenceTransforms(rules, rule, parsedRules)({ variable: v }),
			temporalTransform: () =>
				parseReferenceTransforms(rules, rule, parsedRules)({
					variable: v.explanation,
					temporalTransform: v.temporalTransform
				}),
			constant: () => ({
				type: v.type,
				nodeValue: v.nodeValue,
				unit: v.unit,
				// eslint-disable-next-line
				jsx: () => <span className={v.type}>{v.rawNode}</span>
			})
		},
		action = propOr(mecanismError, k, dispatch)

	return action(parse(rules, rule, parsedRules), k, v)
}
