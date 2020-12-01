import React from 'react'
import { Mecanism } from '../components/mecanisms/common'
import { ASTNode } from '../AST/types'
import { evaluateArray, makeJsx } from '../evaluation'
import { registerEvaluationFunction } from '../evaluationFunctions'
import parse from '../parse'

export type MaxNode = {
	explanation: Array<ASTNode>
	nodeKind: 'maximum'
	jsx: any
}

export const mecanismMax = (v, context) => {
	const explanation = v.map((node) => parse(node, context))

	const jsx = ({ nodeValue, explanation, unit }) => (
		<Mecanism name="le maximum de" value={nodeValue} unit={unit}>
			<ul>
				{explanation.map((item, i) => (
					<li key={i}>
						<div className="description">{v[i].description}</div>
						{makeJsx(item)}
					</li>
				))}
			</ul>
		</Mecanism>
	)

	return {
		jsx,
		explanation,
		nodeKind: 'maximum',
	} as MaxNode
}

const max = (a, b) => {
	if (a === false) {
		return b
	}
	if (b === false) {
		return a
	}
	if (a === null || b === null) {
		return null
	}
	return Math.max(a, b)
}
const evaluate = evaluateArray<'maximum'>(max, false)
registerEvaluationFunction('maximum', evaluate)
