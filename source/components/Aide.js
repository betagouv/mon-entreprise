import React, {Component} from 'react'
import {connect} from 'react-redux'
import {findRuleByName} from '../engine/rules'
import './Aide.css'
import {EXPLAIN_VARIABLE} from '../actions'

@connect(
	state =>
		({explained: state.explainedVariable}),
	dispatch => ({
		stopExplaining: () => dispatch(
			{type: EXPLAIN_VARIABLE})
	})
)
export default class Aide extends Component {
	render() {
		let {explained, stopExplaining} = this.props

		if (!explained) return <section id="help" />

		let rule = findRuleByName(explained),
			text = rule.description || rule.titre

		let possibilities = rule['choix exclusifs']

		return (
			<section id="help" className="active">
				<i className="fa fa-info-circle"></i>
				<i
					className="fa fa-times-circle"
					onClick={stopExplaining} ></i>
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
