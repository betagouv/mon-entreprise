import React, { Component } from "react"
import {makeJsx} from '../evaluation'
import {path} from 'ramda'
import {Node, NodeValue} from './common'


export default ({explanation, nodeValue}) =>
		<Node
			classes="mecanism somme"
			name="somme"
			value={nodeValue}
			child={<Table explanation={explanation}/>}
		/>

let Table = ({explanation}) => <table>
	<caption />
	<tbody>
		{explanation.map((v, i) => <Row {...{v, i}}/>)}
	</tbody>
</table>


class Row extends Component {
	render() {
		let {v, i} = this.props,
			rowFormula = path(["explanation", "formule", "explanation"], v),
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
							<Table explanation={rowFormula.explanation}/>
						</td>
					</tr>
				]
				: [])
		]
	}
}
