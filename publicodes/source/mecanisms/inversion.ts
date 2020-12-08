import parse from '../parse'
import { EvaluationFunction } from '..'
import { ConstantNode, Unit } from '../AST/types'
import { mergeMissing } from '../evaluation'
import { registerEvaluationFunction } from '../evaluationFunctions'
import { convertNodeToUnit } from '../nodeUnits'
import { Context } from '../parsePublicodes'
import { ReferenceNode } from '../reference'
import uniroot from '../uniroot'
import { parseUnit } from '../units'
import { UnitéNode } from './unité'

export type InversionNode = {
	explanation: {
		ruleToInverse: string
		inversionCandidates: Array<ReferenceNode>
		unit?: Unit
	}
	nodeKind: 'inversion'
}

// The user of the inversion mechanism has to define a list of "inversion
// candidates". At runtime, the evaluation function of the mechanism will look
// at the situation value of these candidates, and use the first one that is
// defined as its "goal" for the inversion
//
// The game is then to find an input such as the computed value of the "goal" is
// equal to its situation value, mathematically we search for the zero of the
// function x → f(x) - goal. The iteration logic between each test is
// implemented in the `uniroot` file.
export const evaluateInversion: EvaluationFunction<'inversion'> = function (
	node
) {
	const inversionGoal = node.explanation.inversionCandidates.find(
		(candidate) =>
			this.parsedSituation[candidate.dottedName as string] != undefined
	)

	if (inversionGoal === undefined) {
		const missingVariables = {
			...Object.fromEntries(
				node.explanation.inversionCandidates.map((candidate) => [
					candidate.dottedName,
					1,
				])
			),
			[node.explanation.ruleToInverse]: 1,
		}
		return {
			...node,
			missingVariables,
			nodeValue: null,
		}
	}
	const evaluatedInversionGoal = this.evaluateNode(inversionGoal)
	const unit = 'unit' in node ? node.unit : evaluatedInversionGoal.unit

	const originalCache = { ...this.cache }
	const originalSituation = { ...this.parsedSituation }
	let inversionNumberOfIterations = 0
	delete this.parsedSituation[inversionGoal.dottedName as string]
	const evaluateWithValue = (n: number) => {
		inversionNumberOfIterations++
		this.cache = {
			_meta: { ...originalCache._meta },
		}
		this.situationVersion++
		this.parsedSituation[node.explanation.ruleToInverse] = {
			unit: unit,
			nodeKind: 'unité',
			explanation: {
				nodeKind: 'constant',
				nodeValue: n,
				type: 'number',
			} as ConstantNode,
		} as UnitéNode

		return convertNodeToUnit(unit, this.evaluateNode(inversionGoal))
	}

	const goal = convertNodeToUnit(unit, evaluatedInversionGoal)
		.nodeValue as number
	let nodeValue: number | null | undefined = null

	// We do some blind attempts here to avoid using the default minimum and
	// maximum of +/- 10^8 that are required by the `uniroot` function. For the
	// first attempt we use the goal value as a very rough first approximation.
	// For the second attempt we do a proportionality coefficient with the result
	// from the first try and the goal value. The two attempts are then used in
	// the following way:
	// - if both results are `null` we assume that the inversion is impossible
	//   because of missing variables
	// - otherwise, we calculate the missing variables of the node as the union of
	//   the missings variables of our two attempts
	// - we cache the result of our two attempts so that `uniroot` doesn't
	//   recompute them
	const x1 = goal
	const y1Node = evaluateWithValue(x1)
	const y1 = y1Node.nodeValue as number
	const coeff = y1 > goal ? 0.9 : 1.2
	const x2 = y1 !== null ? (x1 * goal * coeff) / y1 : 2000
	const y2Node = evaluateWithValue(x2)
	const y2 = y2Node.nodeValue as number

	const missingVariables = mergeMissing(
		y1Node.missingVariables,
		y2Node.missingVariables
	)

	if (y1 !== null || y2 !== null) {
		// The `uniroot` function parameter. It will be called with its `min` and
		// `max` arguments, so we can use our cached nodes if the function is called
		// with the already computed x1 or x2.
		const test = (x: number): number => {
			const y = x === x1 ? y1 : x === x2 ? y2 : evaluateWithValue(x).nodeValue
			return (y as number) - goal
		}

		const defaultMin = -1000000
		const defaultMax = 100000000
		const nearestBelowGoal =
			y2 !== null && y2 < goal && (y2 > y1 || y1 > goal)
				? x2
				: y1 !== null && y1 < goal && (y1 > y2 || y2 > goal)
				? x1
				: defaultMin
		const nearestAboveGoal =
			y2 !== null && y2 > goal && (y2 < y1 || y1 < goal)
				? x2
				: y1 !== null && y1 > goal && (y1 < y2 || y2 < goal)
				? x1
				: defaultMax

		nodeValue = uniroot(test, nearestBelowGoal, nearestAboveGoal, 0.1, 10, 1)
	}
	if (nodeValue === undefined) {
		nodeValue = null
		originalCache._meta.inversionFail = true
	}

	// // Uncomment to display the two attempts and their result
	// console.table([{ x: x1, y: y1 }, { x: x2, y: y2 }])
	// console.log('iteration:', inversionNumberOfIterations)
	this.situationVersion++
	this.cache = originalCache
	this.parsedSituation = originalSituation
	return {
		...node,
		unit,
		nodeValue,
		explanation: {
			...node.explanation,
			inversionGoal,
			inversionNumberOfIterations,
		},
		missingVariables,
	}
}

export const mecanismInversion = (v, context: Context) => {
	if (!v.avec) {
		throw new Error(
			"Une formule d'inversion doit préciser _avec_ quoi on peut inverser la variable"
		)
	}
	return {
		explanation: {
			ruleToInverse: context.dottedName,
			inversionCandidates: v.avec.map((node) => parse(node, context)),
		},
		...('unité' in v && { unit: parseUnit(v.unité) }),
		nodeKind: 'inversion',
	} as InversionNode
}

registerEvaluationFunction('inversion', evaluateInversion)
