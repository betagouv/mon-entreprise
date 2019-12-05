import {
	defaultNode,
	evaluateNode,
	makeJsx,
	parseObject
} from 'Engine/evaluation'
import { Node } from 'Engine/mecanismViews/common'
import React from 'react'
import { val } from '../traverse-common-functions'

function MecanismEncadrement({ nodeValue, explanation }) {
	return (
		<Node
			classes="mecanism encadrement"
			name="encadrement"
			value={nodeValue}
			unit={explanation.unit}
			child={
				<>
					{makeJsx(explanation.valeur)}
					<ul className="properties">
						{!explanation.plancher.isDefault && (
							<li key="plancher">
								<span
									style={
										nodeValue === val(explanation.plancher)
											? { background: 'yellow' }
											: {}
									}
								>
									<span className="key">Minimum :</span>
									<span className="value">{makeJsx(explanation.plancher)}</span>
								</span>
							</li>
						)}
						{!explanation.plafond.isDefault && (
							<li key="plafond">
								<span
									style={
										nodeValue === val(explanation.plafond)
											? { background: 'yellow' }
											: {}
									}
								>
									<span className="key">Plafonné à :</span>
									<span className="value">{makeJsx(explanation.plafond)}</span>
								</span>
							</li>
						)}
					</ul>
				</>
			}
		/>
	)
}

const objectShape = {
	valeur: false,
	plafond: defaultNode(Infinity),
	plancher: defaultNode(-Infinity)
}

const evaluate = (cache, situation, parsedRules, node) => {
	const valeur = evaluateNode(
		cache,
		situation,
		parsedRules,
		node.explanation.valeur
	)
	const plafond = evaluateNode(
		cache,
		situation,
		parsedRules,
		node.explanation.plafond
	)
	const plancher = evaluateNode(
		cache,
		situation,
		parsedRules,
		node.explanation.plancher
	)
	const nodeValue = Math.max(val(plancher), Math.min(val(plafond), val(valeur)))
	return { ...node, nodeValue }
}

export default (recurse, k, v) => {
	const explanation = parseObject(recurse, objectShape, v)

	return {
		evaluate,
		// eslint-disable-next-line
		jsx: (nodeValue, explanation) => (
			<MecanismEncadrement nodeValue={nodeValue} explanation={explanation} />
		),
		explanation,
		category: 'mecanism',
		name: 'encadrement',
		type: 'numeric',
		unit: explanation.valeur.unit
	}
}
