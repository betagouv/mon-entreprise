import { Grammar, Parser } from 'nearley'
import { isEmpty } from 'ramda'
import { ASTNode } from './AST/types'
import { EngineError, syntaxError } from './error'
import grammar from './grammar.ne'
import applicable from './mecanisms/applicable'
import arrondi from './mecanisms/arrondi'
import barème from './mecanisms/barème'
import { decompose } from './mecanisms/composantes'
import { mecanismAllOf } from './mecanisms/condition-allof'
import { mecanismOneOf } from './mecanisms/condition-oneof'
import durée from './mecanisms/durée'
import grille from './mecanisms/grille'
import { mecanismInversion } from './mecanisms/inversion'
import { mecanismMax } from './mecanisms/max'
import { mecanismMin } from './mecanisms/min'
import nonApplicable from './mecanisms/nonApplicable'
import { mecanismOnePossibility } from './mecanisms/one-possibility'
import operations from './mecanisms/operation'
import parDéfaut from './mecanisms/parDéfaut'
import plafond from './mecanisms/plafond'
import plancher from './mecanisms/plancher'
import { mecanismProduct } from './mecanisms/product'
import { mecanismRecalcul } from './mecanisms/recalcul'
import { mecanismReduction } from './mecanisms/reduction'
import situation from './mecanisms/situation'
import { mecanismSum } from './mecanisms/sum'
import { mecanismSynchronisation } from './mecanisms/synchronisation'
import tauxProgressif from './mecanisms/tauxProgressif'
import unité from './mecanisms/unité'
import variableTemporelle from './mecanisms/variableTemporelle'
import variations, { devariate } from './mecanisms/variations'
import { Context } from './parsePublicodes'
import parseReference from './reference'
import parseRule from './rule'

export default function parse(rawNode, context: Context): ASTNode {
	if (rawNode == null) {
		syntaxError(
			context.dottedName,
			`
Une des valeurs de la formule est vide.
Vérifiez que tous les champs à droite des deux points sont remplis`
		)
	}
	if (typeof rawNode === 'boolean') {
		syntaxError(
			context.dottedName,
			`
Les valeurs booléennes true / false ne sont acceptées.
Utilisez leur contrepartie française : 'oui' / 'non'`
		)
	}
	const node =
		typeof rawNode === 'object' ? rawNode : parseExpression(rawNode, context)
	if ('nom' in node) {
		return parseRule(node, context)
	}

	return {
		...parseChainedMecanisms(node, context),
		rawNode,
	}
}

const compiledGrammar = Grammar.fromCompiled(grammar)

function parseExpression(
	rawNode,
	context: Context
): Record<string, unknown> | undefined {
	/* Strings correspond to infix expressions.
	 * Indeed, a subset of expressions like simple arithmetic operations `3 + (quantity * 2)` or like `salary [month]` are more explicit that their prefixed counterparts.
	 * This function makes them prefixed operations. */
	try {
		const [parseResult] = new Parser(compiledGrammar).feed(rawNode + '').results
		return parseResult
	} catch (e) {
		syntaxError(
			context.dottedName,
			`\`${rawNode}\` n'est pas une expression valide`,
			e
		)
	}
}

function parseMecanism(rawNode, context: Context) {
	if (Array.isArray(rawNode)) {
		syntaxError(
			context.dottedName,
			`
Il manque le nom du mécanisme pour le tableau : [${rawNode
				.map((x) => `'${x}'`)
				.join(', ')}]
Les mécanisme possibles sont : 'somme', 'le maximum de', 'le minimum de', 'toutes ces conditions', 'une de ces conditions'.
		`
		)
	}

	const keys = Object.keys(rawNode)
	if (keys.length > 1) {
		syntaxError(
			context.dottedName,
			`
Les mécanismes suivants se situent au même niveau : ${keys
				.map((x) => `'${x}'`)
				.join(', ')}
Cela vient probablement d'une erreur dans l'indentation
	`
		)
	}
	if (isEmpty(rawNode)) {
		return { nodeKind: 'constant', nodeValue: null }
	}

	const mecanismName = Object.keys(rawNode)[0]
	const values = rawNode[mecanismName]
	const parseFn = parseFunctions[mecanismName]

	if (!parseFn) {
		syntaxError(
			context.dottedName,
			`
Le mécanisme ${mecanismName} est inconnu.
Vérifiez qu'il n'y ait pas d'erreur dans l'orthographe du nom.`
		)
	}
	try {
		// Mécanisme de composantes. Voir mécanismes.md/composantes
		if (values?.composantes) {
			return decompose(mecanismName, values, context)
		}
		if (values?.variations && Object.values(values).length > 1) {
			return devariate(mecanismName, values, context)
		}
		return parseFn(values, context)
	} catch (e) {
		if (e instanceof EngineError) {
			throw e
		}
		syntaxError(
			context.dottedName,
			mecanismName
				? `➡️ Dans le mécanisme ${mecanismName}
${e.message}`
				: e.message
		)
	}
}

const chainableMecanisms = [
	applicable,
	nonApplicable,
	parDéfaut,
	arrondi,
	unité,
	plancher,
	plafond,
	situation,
]
function parseChainedMecanisms(rawNode, context: Context): ASTNode {
	const parseFn = chainableMecanisms.find((fn) => fn.nom in rawNode)
	if (!parseFn) {
		return parseMecanism(rawNode, context)
	}
	const { [parseFn.nom]: param, ...valeur } = rawNode
	return parseMecanism(
		{
			[parseFn.nom]: {
				valeur,
				[parseFn.nom]: param,
			},
		},
		context
	)
}

const parseFunctions = {
	...operations,
	...chainableMecanisms.reduce((acc, fn) => ({ [fn.nom]: fn, ...acc }), {}),
	'une possibilité': mecanismOnePossibility,
	'inversion numérique': mecanismInversion,
	recalcul: mecanismRecalcul,
	variable: parseReference,
	'une de ces conditions': mecanismOneOf,
	'toutes ces conditions': mecanismAllOf,
	somme: mecanismSum,
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
	valeur: parse,
	objet: (v) => ({
		type: 'objet',
		nodeValue: v,
		nodeKind: 'constant',
	}),
	constant: (v) => ({
		type: v.type,
		// In the documentation we want to display constants defined in the source
		// with their full precision. This is especially useful for percentages like
		// APEC 0,036 %.
		fullPrecision: true,
		nodeValue: v.nodeValue,
		nodeKind: 'constant',
	}),
}

export const mecanismKeys = Object.keys(parseFunctions)
