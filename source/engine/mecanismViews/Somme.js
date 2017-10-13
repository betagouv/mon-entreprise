import React, { Component } from "react"
import { makeJsx } from "../evaluation"
import { path } from "ramda"
import { Node, NodeValue } from "./common"
import './Somme.css'

export default ({ explanation, nodeValue }) => (
	<Node
		classes="mecanism somme"
		name="somme"
		value={nodeValue}
		child={<Table explanation={explanation} />}
	/>
)

let Table = ({ explanation }) => (
	<table>
		<caption />
		<tbody>{explanation.map((v, i) => <Row key={i} {...{ v, i }} />)}</tbody>
	</table>
)

/* La colonne peut au clic afficher une nouvelle colonne qui sera une autre somme imbriquée */
class Row extends Component {
	state = {
		folded: true
	}
	render() {
		let { v, i } = this.props,
			rowFormula = path(["explanation", "formule", "explanation"], v),
			isSomme = rowFormula && rowFormula.name == "somme"

		return [
			<tr
				key={v.name}
				className={isSomme ? "" : "noNest"}
				onClick={() => this.setState({ folded: false })}
			>
				<td className="operator blank">{i != 0 && "+"}</td>
				<td className="element">
					{makeJsx(v)}
				</td>
				<td className="situationValue value">
					<NodeValue data={v.nodeValue} />
				</td>
			</tr>,
			...(isSomme && !this.state.folded
				? [
					<tr className="nested" key={v.name + "-nest"}>
						<td className="blank" />
						<td className="nested">
							<Table explanation={rowFormula.explanation} />
						</td>
					</tr>
				]
				: [])
		]
	}
}
