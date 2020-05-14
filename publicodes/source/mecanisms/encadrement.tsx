import React from 'react'
import { Node } from '../components/mecanisms/common'
import { typeWarning } from '../error'
import {
	defaultNode,
	evaluateObject,
	makeJsx,
	parseObject
} from '../evaluation'
import { convertNodeToUnit } from '../nodeUnits'

function MecanismEncadrement({ nodeValue, explanation, unit }) {
	return (
		<div>
			{makeJsx(explanation.valeur)}
			{!explanation.plancher.isDefault && (
				<>
					<br />

					<span
						style={
							nodeValue === explanation.plancher.nodeValue
								? { background: 'yellow' }
								: {}
						}
					>
						<strong className="key">Minimum : </strong>
						<span className="value">{makeJsx(explanation.plancher)}</span>
					</span>
				</>
			)}
			{!explanation.plafond.isDefault && (
				<>
					<br />
					<span
						style={
							nodeValue === explanation.plancher.nodeValue
								? { background: 'yellow' }
								: {}
						}
					>
						<strong className="key">Plafonné à : </strong>
						<span className="value">{makeJsx(explanation.plafond)}</span>
					</span>
				</>
			)}
		</div>
	)
}

const objectShape = {
	valeur: false,
	plafond: defaultNode(Infinity),
	plancher: defaultNode(-Infinity)
}

const evaluate = evaluateObject(
	objectShape,
	({ valeur, plafond, plancher }, cache) => {
		if (plafond.nodeValue === false || plafond.nodeValue === null) {
			plafond = objectShape.plafond
		}

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
		return {
			nodeValue:
				typeof valeur.nodeValue !== 'number'
					? valeur.nodeValue
					: Math.max(
							plancher.nodeValue,
							Math.min(plafond.nodeValue, valeur.nodeValue)
					  ),
			unit: valeur.unit
		}
	}
)

export default (recurse, k, v) => {
	const explanation = parseObject(recurse, objectShape, v)

	return {
		evaluate,
		jsx: MecanismEncadrement,
		explanation,
		category: 'mecanism',
		name: 'encadrement',
		type: 'numeric',
		unit: explanation.valeur.unit
	}
}
