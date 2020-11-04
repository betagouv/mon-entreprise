// This should be the new way to implement mecanisms
// In a specific file
// TODO import them automatically
import { Grammar, Parser } from 'nearley'
import {
	add,
	difference,
	divide,
	equals,
	fromPairs,
	gt,
	gte,
	lt,
	lte,
	multiply,
	omit,
	subtract
} from 'ramda'
import React from 'react'
import { EngineError, syntaxError } from './error'
import { formatValue } from './format'
import grammar from './grammar.ne'
import arrondi from './mecanisms/arrondi'
import barème from './mecanisms/barème'
import { mecanismAllOf } from './mecanisms/condition-allof'
import { mecanismOneOf } from './mecanisms/condition-oneof'
import durée from './mecanisms/durée'
import plafond from './mecanisms/plafond'
import plancher from './mecanisms/plancher'
import applicable from './mecanisms/applicable'
import nonApplicable from './mecanisms/nonApplicable'
import grille from './mecanisms/grille'
import { mecanismInversion } from './mecanisms/inversion'
import { mecanismMax } from './mecanisms/max'
import { mecanismMin } from './mecanisms/min'
import { mecanismOnePossibility } from './mecanisms/one-possibility'
import operation from './mecanisms/operation'
import { mecanismProduct } from './mecanisms/product'
import { mecanismRecalcul } from './mecanisms/recalcul'
import { mecanismReduction } from './mecanisms/reduction'
import régularisation from './mecanisms/régularisation'
import { mecanismSum } from './mecanisms/sum'
import { mecanismSynchronisation } from './mecanisms/synchronisation'
import tauxProgressif from './mecanisms/tauxProgressif'
import { decompose } from './mecanisms/utils'
import variableTemporelle from './mecanisms/variableTemporelle'
import variations, { devariate } from './mecanisms/variations'
import { parseReferenceTransforms } from './parseReference'
import { EvaluatedRule } from './types'

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

const parseExpression = (rule, rawNode) => {
	/* Strings correspond to infix expressions.
	 * Indeed, a subset of expressions like simple arithmetic operations `3 + (quantity * 2)` or like `salary [month]` are more explicit that their prefixed counterparts.
	 * This function makes them prefixed operations. */
	try {
		const [parseResult] = new Parser(compiledGrammar).feed(rawNode).results
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

	rawNode = unfoldChainedMecanisms(rawNode)
	const keys = Object.keys(rawNode)
	if (keys.length > 1) {
		syntaxError(
			rule.dottedName,
			`
Les mécanismes suivants se situent au même niveau : ${keys
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
		const recurse = parse(rules, rule, parsedRules)
		// Mécanisme de composantes. Voir mécanismes.md/composantes
		if (values?.composantes) {
			return decompose(recurse, mecanismName, values)
		}
		if (values?.variations) {
			return devariate(recurse, mecanismName, values)
		}
		return parseFn(recurse, values)
	} catch (e) {
		if (e instanceof EngineError) {
			throw e
		}
		syntaxError(rule.dottedName, e.message)
	}
}

const chainableMecanisms = [
	applicable,
	nonApplicable,
	plancher,
	plafond,
	arrondi
]
function unfoldChainedMecanisms(rawNode) {
	if (Object.keys(rawNode).length === 1) {
		return rawNode
	}
	return chainableMecanisms.reduceRight(
		(node, parseFn) => {
			if (!(parseFn.nom in rawNode)) {
				return node
			}
			return {
				[parseFn.nom]: {
					[parseFn.nom]: rawNode[parseFn.nom],
					valeur: node
				}
			}
		},
		omit(
			chainableMecanisms.map(fn => fn.nom),
			rawNode
		)
	)
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
	...chainableMecanisms.reduce((acc, fn) => ({ [fn.nom]: fn, ...acc }), {}),
	'une de ces conditions': mecanismOneOf,
	'toutes ces conditions': mecanismAllOf,
	somme: mecanismSum,
	régularisation,
	multiplication: mecanismProduct,
	produit: mecanismProduct,
	temporalValue: variableTemporelle,
	barème,
	grille,
	'taux progressif': tauxProgressif,
	durée,
	'le maximum de': mecanismMax,
	'le minimum de': mecanismMin,
	allègement: mecanismReduction,
	variations,
	synchronisation: mecanismSynchronisation,
	valeur: (recurse, v) => recurse(v),
	constant: (_, v) => ({
		type: v.type,
		constant: true,
		nodeValue: v.nodeValue,
		unit: v.unit,
		// eslint-disable-next-line
		jsx: (node: EvaluatedRule) => (
			<span className={v.type}>
				{formatValue(node, {
					// We want to display constants with full precision,
					// espacilly for percentages like APEC 0,036 %
					precision: 5
				})}
			</span>
		)
	})
}
