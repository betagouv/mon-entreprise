import React, { Component } from "react"
import {makeJsx} from '../evaluation'
import {path} from 'ramda'
import {Node, NodeValue} from '../traverse-common-jsx'


export default class Somme extends Component {
	render() {
		let {explanation, nodeValue} = this.props
		return <Node
			classes="mecanism somme"
			name="somme"
			value={nodeValue}
			child={
				this.renderTable(explanation)
			}
		/>
	}
	renderTable = explanation => (
		<table>
			<caption />
			<tbody>
				{explanation.map((v, i) => {
					let rowFormula = path(["explanation", "formule", "explanation"], v),
						isSomme = rowFormula && rowFormula.name == "somme"

					return [
						<tr key={v.name} className={isSomme ? "" : "noNest"}>
							<td className="operator blank">{i != 0 && "+"}</td>
							<td className="element">{makeJsx(v)}</td>
							<td className="situationValue value">
								<NodeValue data={v.nodeValue} />
							</td>
						</tr>,
						...(isSomme
							? [
								<tr className="nested">
									<td className="blank" />
									<td className="nested">
										{this.renderTable(rowFormula.explanation)}
									</td>
								</tr>
							]
							: [])
					]
				})}
			</tbody>
		</table>
	)
}
