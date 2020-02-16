// This should be the new way to implement mecanisms
// In a specific file
// TODO import them automatically
// TODO convert the legacy functions to new files
import Value from 'Components/Value'
import mecanismRound from 'Engine/mecanisms/arrondi'
import barème from 'Engine/mecanisms/barème'
import durée from 'Engine/mecanisms/durée'
import encadrement from 'Engine/mecanisms/encadrement'
import grille from 'Engine/mecanisms/grille'
import operation from 'Engine/mecanisms/operation'
import tauxProgressif from 'Engine/mecanisms/tauxProgressif'
import variableTemporelle from 'Engine/mecanisms/variableTemporelle'
import variations from 'Engine/mecanisms/variations'
import { Grammar, Parser } from 'nearley'
import {
	add,
	divide,
	equals,
	fromPairs,
	gt,
	gte,
	lt,
	lte,
	multiply,
	subtract
} from 'ramda'
import React from 'react'
import { EngineError, syntaxError } from './error'
import grammar from './grammar.ne'
import {
	mecanismAllOf,
	mecanismInversion,
	mecanismMax,
	mecanismMin,
	mecanismOneOf,
	mecanismOnePossibility,
	mecanismProduct,
	mecanismRecalcul,
	mecanismReduction,
	mecanismSum,
	mecanismSynchronisation
} from './mecanisms'
import { parseReferenceTransforms } from './parseReference'

export const parse = (rules, rule, parsedRules) => rawNode => {
	if (rawNode == null) {
		syntaxError(
			rule.dottedName,
			`
Une des valeurs de la formule est vide.
Vérifiez que tous les champs à droite des deux points sont remplis`
		)
	}
	if (typeof rawNode === 'boolean') {
		syntaxError(
			rule.dottedName,
			`
Les valeure booléenes true / false ne sont acceptée.
Utilisez leur contrepartie française : 'oui' / 'non'`
		)
	}
	const node =
		typeof rawNode === 'object' ? rawNode : parseExpression(rule, '' + rawNode)

	const parsedNode = parseMecanism(rules, rule, parsedRules)(node)
	parsedNode.evaluate = parsedNode.evaluate ?? ((_, __, ___, node) => node)
	return parsedNode
}

const compiledGrammar = Grammar.fromCompiled(grammar)

export const parseExpression = (rule, rawNode) => {
	/* Strings correspond to infix expressions.
	 * Indeed, a subset of expressions like simple arithmetic operations `3 + (quantity * 2)` or like `salary [month]` are more explicit that their prefixed counterparts.
	 * This function makes them prefixed operations. */
	try {
		let [parseResult] = new Parser(compiledGrammar).feed(rawNode).results
		return parseResult
	} catch (e) {
		syntaxError(
			rule.dottedName,
			`\`${rawNode}\` n'est pas une expression valide`,
			e
		)
	}
}

const parseMecanism = (rules, rule, parsedRules) => rawNode => {
	if (Array.isArray(rawNode)) {
		syntaxError(
			rule.dottedName,
			`
Il manque le nom du mécanisme pour le tableau : [${rawNode
				.map(x => `'${x}'`)
				.join(', ')}]
Les mécanisme possibles sont : 'somme', 'le maximum de', 'le minimum de', 'toutes ces conditions', 'une de ces conditions'.
		`
		)
	}
	if (Object.keys(rawNode).length > 1) {
		syntaxError(
			rule.dottedName,
			`
Les mécanismes suivants se situent au même niveau : ${Object.keys(rawNode)
				.map(x => `'${x}'`)
				.join(', ')}
Cela vient probablement d'une erreur dans l'indentation
		`
		)
	}
	const mecanismName = Object.keys(rawNode)[0]
	const values = rawNode[mecanismName]

	const parseFunctions = {
		...statelessParseFunction,
		'une possibilité': mecanismOnePossibility(rule.dottedName),
		'inversion numérique': mecanismInversion(rule.dottedName),
		recalcul: mecanismRecalcul(rule.dottedName),
		filter: () =>
			parseReferenceTransforms(
				rules,
				rule,
				parsedRules
			)({
				filter: values.filter,
				variable: values.explanation
			}),
		variable: () =>
			parseReferenceTransforms(rules, rule, parsedRules)({ variable: values }),
		unitConversion: () =>
			parseReferenceTransforms(
				rules,
				rule,
				parsedRules
			)({
				variable: values.explanation,
				unit: values.unit
			})
	}

	const parseFn = parseFunctions[mecanismName]
	if (!parseFn) {
		syntaxError(
			rule.dottedName,
			`
Le mécanisme ${mecanismName} est inconnu.
Vérifiez qu'il n'y ait pas d'erreur dans l'orthographe du nom.`
		)
	}
	try {
		return parseFn(parse(rules, rule, parsedRules), mecanismName, values)
	} catch (e) {
		if (e instanceof EngineError) {
			throw e
		}
		syntaxError(rule.dottedName, e.message)
	}
}

const knownOperations = {
	'*': [multiply, '×'],
	'/': [divide, '∕'],
	'+': [add],
	'-': [subtract, '−'],
	'<': [lt],
	'<=': [lte, '≤'],
	'>': [gt],
	'>=': [gte, '≥'],
	'=': [equals],
	'!=': [(a, b) => !equals(a, b), '≠']
}

const operationDispatch = fromPairs(
	Object.entries(knownOperations).map(([k, [f, symbol]]) => [
		k,
		operation(k, f, symbol)
	])
)

const statelessParseFunction = {
	...operationDispatch,
	'une de ces conditions': mecanismOneOf,
	'toutes ces conditions': mecanismAllOf,
	somme: mecanismSum,
	multiplication: mecanismProduct,
	produit: mecanismProduct,
	temporalValue: variableTemporelle,
	arrondi: mecanismRound,
	barème,
	grille,
	'taux progressif': tauxProgressif,
	encadrement,
	durée,
	'le maximum de': mecanismMax,
	'le minimum de': mecanismMin,
	allègement: mecanismReduction,
	variations,
	synchronisation: mecanismSynchronisation,
	constant: (_, __, v) => ({
		type: v.type,
		nodeValue: v.nodeValue,
		unit: v.unit,
		// eslint-disable-next-line
		jsx: (nodeValue, _, __, unit) => (
			<span className={v.type}>
				<Value
					{...{
						unit,
						nodeValue,
						// We want to display constants with full precision,
						// espacilly for percentages like APEC 0,036 %
						maximumFractionDigits: 5
					}}
				/>
			</span>
		)
	})
}
