import React, {Component} from 'react'
import {connect} from 'react-redux'
import {findRuleByName} from '../engine/rules'


@connect(
	state =>
		({explained: state.explainedVariable})
)
export default class Aide extends Component {
	render() {
		let {explained} = this.props

		if (!explained) return <section id="help" />

		let rule = findRuleByName(explained),
			text = rule.description || rule.titre

		let possibilities = rule['choix exclusifs']

		return (
			<section id="help" className="active">
				<p>
					{text}
				</p>
				{ possibilities &&
					<p>
						{possibilities.length} possibilités :
						<ul>
							{possibilities.map(p =>
								<li key={p}>{p}</li>
							)}
						</ul>
					</p>
				}
			</section>
		)
	}
}
