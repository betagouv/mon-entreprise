import { typeWarning } from 'Engine/error'
import { evaluateNode } from 'Engine/evaluation'
import { Node } from 'Engine/mecanismViews/common'
import { areUnitConvertible, serialiseUnit } from 'Engine/units'
import { toPairs, values } from 'ramda'
import React from 'react'

const Correspondance = (nodeValue, explanation) => (
	<Component {...{ nodeValue, explanation }} />
)

let Component = ({ nodeValue, explanation }) => (
	<Node
		classes="mecanism correspondance"
		name="correspondance"
		value={nodeValue}
		unit={explanation.unit}
		child={
			<table>
				<thead>
					<tr>
						<th css="text-transform: capitalize">{explanation.variable}</th>
						<th>Valeur</th>
					</tr>
				</thead>
				<tbody>
					{toPairs(explanation.tableau).map(([k, v]) => (
						<tr
							key={k}
							style={explanation.selected === k ? { background: 'yellow' } : {}}
						>
							<td>{k}</td>
							<td>{v as any}</td>
						</tr>
					))}
				</tbody>
			</table>
		}
	/>
)

export default (recurse, k, v) => {
	let evaluate = (cache, situationGate, parsedRules, node) => {
		let { variable: variableName, tableau } = node.explanation

		let variable = evaluateNode(
			cache,
			situationGate,
			parsedRules,
			recurse(variableName)
		)

		if (variable.nodeValue == null)
			return {
				...node,
				nodeValue: null,
				explanation: v,
				missingVariables: { [variable.dottedName]: 1 }
			}
		else
			return {
				...node,
				nodeValue: evaluateNode(
					cache,
					situationGate,
					parsedRules,
					recurse(tableau[variable.nodeValue])
				).nodeValue,
				explanation: { ...v, selected: variable.nodeValue },
				missingVariables: {}
			}
	}

	const unit = recurse(values(v.tableau)[0])?.unit

	values(v.tableau).forEach(({ unit: unit2 }) => {
		try {
			areUnitConvertible(unit, unit2)
		} catch (e) {
			typeWarning(
				v,
				`Dans le tableau de correspondance de '${
					v.explanation.variable
				}', les unités ${serialiseUnit(unit)} et ${serialiseUnit(
					unit2
				)} ne sont pas compatibles entre elles`,
				e
			)
		}
	})

	return {
		explanation: v,
		evaluate,
		unit,
		jsx: Correspondance,
		category: 'mecanism',
		name: 'correspondance'
	}
}
