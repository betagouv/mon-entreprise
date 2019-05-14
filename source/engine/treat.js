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
	mecanismVariations,
	mecanismOnePossibility
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
	/* Strings correspond to infix expressions.
	 * Indeed, a subset of expressions like simple arithmetic operations `3 + (quantity * 2)` or like `salary [month]` are more explicit that their prefixed counterparts.
	 * This function makes them prefixed operations. */

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

	return treatObject(rules, rule)(parseResult)
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
			'une possibilité': mecanismOnePossibility,
			'inversion numérique': mecanismInversion(rule.dottedName),
			allègement: mecanismReduction,
			variations: mecanismVariations,
			synchronisation: mecanismSynchronisation
		},
		action = propOr(mecanismError, k, dispatch)

	return action(treat(rules, rule, treatOptions), k, v)
}
