import { min } from 'ramda'
import React from 'react'
import { Mecanism } from '../components/mecanisms/common'
import { ASTNode } from '../AST/types'
import { evaluateArray, makeJsx } from '../evaluation'
import { registerEvaluationFunction } from '../evaluationFunctions'
import parse from '../parse'

export type MinNode = {
	explanation: Array<ASTNode>
	nodeKind: 'minimum'
	jsx: any
}
export const mecanismMin = (v, context) => {
	const explanation = v.map(node => parse(node, context))
	const jsx = ({ nodeValue, explanation, unit }) => (
		<Mecanism name="le minimum de" value={nodeValue} unit={unit}>
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
		nodeKind: 'minimum'
	} as MinNode
}

const evaluate = evaluateArray<'minimum'>(min, Infinity)

registerEvaluationFunction('minimum', evaluate)
