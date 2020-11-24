import { evaluationFunction } from '..'
import { ASTNode } from '../AST/types'
import { registerEvaluationFunction } from '../evaluationFunctions'
import parse from '../parse'
import {
	createTemporalEvaluation,
	narrowTemporalValue,
	Temporal,
	temporalAverage
} from '../temporal'

export type VariableTemporelleNode = {
	explanation: {
		period: {
			start: ASTNode | undefined
			end: ASTNode | undefined
		}
		value: ASTNode
	}
	jsx: any

	nodeKind: 'variable temporelle'
}

const evaluate: evaluationFunction<'variable temporelle'> = function(
	node: any
) {
	const start =
		node.explanation.period.start &&
		this.evaluateNode(node.explanation.period.start)
	const end =
		node.explanation.period.end &&
		this.evaluateNode(node.explanation.period.end)
	const value = this.evaluateNode(node.explanation.value)
	const period = {
		start: start?.nodeValue || null,
		end: end?.nodeValue || null
	}
	const temporalValue = value.temporalValue
		? narrowTemporalValue(period, value.temporalValue)
		: createTemporalEvaluation(value.nodeValue, period)
	// TODO explanation missingVariables / period missing variables
	return {
		...node,
		nodeValue: temporalAverage(temporalValue as Temporal<number>, value.unit),
		temporalValue,
		explanation: {
			period: { start, end },
			value
		},
		...('unit' in value && { unit: value.unit })
	}
}

export default function parseVariableTemporelle(
	v,
	context
): VariableTemporelleNode {
	const explanation = parse(v.explanation, context)
	return {
		nodeKind: 'variable temporelle',
		jsx: () => 'variable temporelle',
		explanation: {
			period: {
				start: v.period.start && parse(v.period.start, context),
				end: v.period.end && parse(v.period.end, context)
			},
			value: explanation
		}
	}
}

registerEvaluationFunction('variable temporelle', evaluate)
