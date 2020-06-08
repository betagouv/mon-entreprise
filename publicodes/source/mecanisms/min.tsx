import { min } from 'ramda'
import React from 'react'
import { Mecanism } from '../components/mecanisms/common'
import { evaluateArray, makeJsx } from '../evaluation'

export const mecanismMin = (recurse, v) => {
	const explanation = v.map(recurse)
	const evaluate = evaluateArray(min, Infinity)
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
		evaluate,
		jsx,
		explanation,
		type: 'numeric',
		category: 'mecanism',
		name: 'le minimum de',
		unit: explanation[0].unit
	}
}
