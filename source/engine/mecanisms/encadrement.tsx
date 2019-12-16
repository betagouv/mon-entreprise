import { typeWarning } from 'Engine/error'
import {
	defaultNode,
	evaluateNode,
	makeJsx,
	parseObject
} from 'Engine/evaluation'
import { Node } from 'Engine/mecanismViews/common'
import { convertNodeToUnit } from 'Engine/nodeUnits'
import React from 'react'
import { val } from '../traverse-common-functions'

function MecanismEncadrement({ nodeValue, explanation, unit }) {
	return (
		<Node
			classes="mecanism encadrement"
			name="encadrement"
			value={nodeValue}
			unit={unit}
			child={
				<>
					{makeJsx(explanation.valeur)}
					<p>
						{!explanation.plancher.isDefault && (
							<span
								css={
									nodeValue === val(explanation.plancher) &&
									'background: yellow'
								}
							>
								<strong className="key">Minimum : </strong>
								<span className="value">{makeJsx(explanation.plancher)}</span>
							</span>
						)}
						{!explanation.plafond.isDefault && (
							<span
								css={
									nodeValue === val(explanation.plafond) && 'background: yellow'
								}
							>
								<strong className="key">Plafonné à : </strong>
								<span className="value">{makeJsx(explanation.plafond)}</span>
							</span>
						)}
					</p>
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
	let evaluateAttribute = evaluateNode.bind(null, cache, situation, parsedRules)
	const valeur = evaluateAttribute(node.explanation.valeur)
	let plafond = evaluateAttribute(node.explanation.plafond)
	let plancher = evaluateAttribute(node.explanation.plancher)
	if (valeur.unit) {
		try {
			plafond = convertNodeToUnit(valeur.unit, plafond)
			plancher = convertNodeToUnit(valeur.unit, plancher)
		} catch (e) {
			typeWarning(
				cache._meta.contextRule,
				"Le plafond / plancher de l'encadrement a une unité incompatible avec celle de la valeur à encadrer",
				e
			)
		}
	}
	const nodeValue = Math.max(val(plancher), Math.min(val(plafond), val(valeur)))
	return {
		...node,
		nodeValue,
		unit: valeur.unit,
		explanation: {
			valeur,
			plafond,
			plancher
		}
	}
}

export default (recurse, k, v) => {
	const explanation = parseObject(recurse, objectShape, v)

	return {
		evaluate,
		// eslint-disable-next-line
		jsx: (nodeValue, explanation, _, unit) => (
			<MecanismEncadrement
				nodeValue={nodeValue}
				explanation={explanation}
				unit={unit}
			/>
		),
		explanation,
		category: 'mecanism',
		name: 'encadrement',
		type: 'numeric',
		unit: explanation.valeur.unit
	}
}
