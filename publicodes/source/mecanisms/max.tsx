import React from 'react'
import { Mecanism } from '../components/mecanisms/common'
import { evaluateArray, makeJsx } from '../evaluation'

export const mecanismMax = (recurse, k, v) => {
	const explanation = v.map(recurse)

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
	const evaluate = evaluateArray(max, Number.NEGATIVE_INFINITY)

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
		evaluate,
		jsx,
		explanation,
		type: 'numeric',
		category: 'mecanism',
		name: 'le maximum de',
		unit: explanation[0].unit
	}
}
