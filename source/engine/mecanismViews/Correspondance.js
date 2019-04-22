import React from 'react'
import { toPairs } from 'ramda'
import { Node } from 'Engine/mecanismViews/common'

export default (nodeValue, explanation) => (
	<Component {...{ nodeValue, explanation }} />
)

let Component = ({ nodeValue, explanation }) => (
	<Node
		classes="mecanism correspondance"
		name="correspondance"
		value={nodeValue}
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
							style={
								explanation.selected === k ? { background: 'yellow' } : {}
							}>
							<td>{k}</td>
							<td>{v}</td>
						</tr>
					))}
				</tbody>
			</table>
		}
	/>
)
