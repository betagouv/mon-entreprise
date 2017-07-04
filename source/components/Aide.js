import React, {Component} from 'react'
import {connect} from 'react-redux'

import marked from 'Engine/marked'
import {rules, findRuleByDottedName} from 'Engine/rules'
import {EXPLAIN_VARIABLE} from '../actions'

import References from './rule/References'
import './Aide.css'

@connect(
	state =>
		({explained: state.explainedVariable}),
	dispatch => ({
		stopExplaining: () => dispatch(
			{type: EXPLAIN_VARIABLE})
	})
)
export default class Aide extends Component {
	renderExplanationMarkdown(explanation, term) {
		return marked(`### ${term} \n\n${explanation}`)
	}
	render() {
		let {explained, stopExplaining} = this.props

		if (!explained) return <section id="helpWrapper" />

		let rule = findRuleByDottedName(rules, explained),
			text = rule.description,
			refs = rule.références

		let possibilities = rule['choix exclusifs']

		return (
			<div id="helpWrapper" className="active">
				<section id="help">
					<i className="fa fa-info-circle"></i>
					<i
						className="fa fa-times-circle"
						onClick={stopExplaining} ></i>
					<p
						dangerouslySetInnerHTML={{__html: this.renderExplanationMarkdown(text, rule.titre)}}>
					</p>
					{/* { possibilities &&
						<p>
							{possibilities.length} possibilités :
							<ul>
								{possibilities.map(p =>
									<li key={p}>{p}</li>
								)}
							</ul>
						</p>
					} */}
					{refs && <div>
						<p>Pour en savoir plus: </p>
						<References refs={refs} />
					</div>}
				</section>
			</div>
		)
	}
}
