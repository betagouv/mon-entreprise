import { evaluateNode, makeJsx } from 'Engine/evaluation'
import { Node } from 'Engine/mecanismViews/common'
import React from 'react'

function MecanismRound({ nodeValue, explanation }) {
	return (
		<Node
			classes="mecanism arrondi"
			name="arrondi"
			value={nodeValue}
			unit={explanation.unit}
			child={makeJsx(explanation)}
		/>
	)
}

export default (recurse, k, v) => {
	const node = recurse(v)

	let evaluate = (cache, situation, parsedRules, node) => {
		const child = evaluateNode(cache, situation, parsedRules, node.explanation)
		const nodeValue =
			child.nodeValue === null ? null : Math.round(child.nodeValue)
		return { ...node, nodeValue, explanation: child }
	}

	return {
		evaluate,
		// eslint-disable-next-line
		jsx: (nodeValue, explanation) => (
			<MecanismRound nodeValue={nodeValue} explanation={explanation} />
		),
		explanation: recurse(v),
		category: 'mecanism',
		name: 'arrondi',
		type: 'numeric',
		unit: node.unit
	}
}
