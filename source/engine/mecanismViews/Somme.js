import { path } from 'ramda'
import React, { Component } from 'react'
import { makeJsx } from '../evaluation'
import './Somme.css'
import { Node, value } from './common'

const SommeNode = ({ explanation, value }) => (
	<Node
		classes="mecanism somme"
		name="somme"
		value={value}
		child={<Table explanation={explanation} />}
	/>
)
export default SommeNode

let Table = ({ explanation }) => (
	<div className="mecanism-somme__table">
		<div>{explanation.map((v, i) => <Row key={i} {...{ v, i }} />)}</div>
	</div>
)

/* La colonne peut au clic afficher une nouvelle colonne qui sera une autre somme imbriquée */
class Row extends Component {
	state = {
		folded: true
	}
	render() {
		let { v, i } = this.props,
			rowFormula = path(['explanation', 'formule', 'explanation'], v),
			isSomme = rowFormula && rowFormula.name == 'somme'

		return [
			<div
				className="mecanism-somme__row"
				key={v.name}
				// className={isSomme ? '' : 'noNest'}
				onClick={() => this.setState({ folded: !this.state.folded })}>
				<div className="operator blank">{i != 0 && '+'}</div>
				<div className="element">
					{makeJsx(v)}
					{isSomme && (
						<button className="unfoldIndication unstyledButton">
							{this.state.folded ? 'déplier' : 'replier'}
						</button>
					)}
				</div>
				<div className="situationValue value">
					<value data={v.value} />
				</div>
			</div>,
			...(isSomme && !this.state.folded
				? [
						<div className="nested" key={v.name + '-nest'}>
							<Table explanation={rowFormula.explanation} />
						</div>
				  ]
				: [])
		]
	}
}
