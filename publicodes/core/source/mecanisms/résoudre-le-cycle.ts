import { EvaluationFunction } from '..'
import { ASTNode, ConstantNode, Unit } from '../AST/types'
import { registerEvaluationFunction } from '../evaluationFunctions'
import parse from '../parse'
import { Context } from '../parsePublicodes'
import uniroot from '../uniroot'
import { UnitéNode } from './unité'

export type RésoudreCycleNode = {
	explanation: {
		ruleToSolve: string
		valeur: ASTNode
	}
	nodeKind: 'résoudre cycle'
}

export const evaluateRésoudreCycle: EvaluationFunction<'résoudre cycle'> = function (
	node
) {
	const originalCache = this.cache
	let inversionNumberOfIterations = 0

	const evaluateWithValue = (
		n: number,
		unit: Unit = { numerators: [], denominators: [] }
	) => {
		inversionNumberOfIterations++
		this.resetCache()
		this.cache._meta = { ...originalCache._meta }

		this.parsedSituation[node.explanation.ruleToSolve] = {
			unit: unit,
			nodeKind: 'unité',
			explanation: {
				nodeKind: 'constant',
				nodeValue: n,
				type: 'number',
			} as ConstantNode,
		} as UnitéNode
		return this.evaluate(node.explanation.valeur)
	}

	let nodeValue: number | null | undefined = null

	const x0 = -1000000
	let valeur = evaluateWithValue(x0)
	const y0 = valeur.nodeValue as number
	const unit = valeur.unit

	const missingVariables = valeur.missingVariables

	if (y0 !== null) {
		// The `uniroot` function parameter. It will be called with its `min` and
		// `max` arguments, so we can use our cached nodes if the function is called
		// with the already computed x1 or x2.
		const test = (x: number): number => {
			if (x === x0) {
				return y0 - x0
			}
			valeur = evaluateWithValue(x, unit)
			const y = valeur.nodeValue
			return (y as number) - x
		}

		const defaultMin = -1_000_000
		const defaultMax = 100_000_000

		nodeValue = uniroot(test, defaultMin, defaultMax, 0.1, 50, 1)
	}
	if (nodeValue === undefined) {
		nodeValue = null
		this.cache._meta.inversionFail = true
	}

	// // Uncomment to display the two attempts and their result
	// console.table([{ x: x1, y: y1 }, { x: x2, y: y2 }])
	console.log(
		'iteration:',
		inversionNumberOfIterations,
		originalCache.nodes.size
	)
	originalCache.nodes.forEach((v, k) => this.cache.nodes.set(k, v))
	// delete this.parsedSituation[node.explanation.ruleToSolve]
	return {
		...node,
		unit,
		nodeValue,
		explanation: {
			...node.explanation,
			valeur,
			inversionNumberOfIterations,
		},
		missingVariables,
	}
}

export default function parseRésoudreCycle(v, context: Context) {
	return {
		explanation: {
			ruleToSolve: context.dottedName,
			valeur: parse(v.valeur, context),
		},
		nodeKind: 'résoudre cycle',
	} as RésoudreCycleNode
}

parseRésoudreCycle.nom = 'résoudre le cycle'

registerEvaluationFunction('résoudre cycle', evaluateRésoudreCycle)
