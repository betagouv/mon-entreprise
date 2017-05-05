import React, {Component} from 'react'
import {connect} from 'react-redux'
import {findRuleByDottedName} from '../engine/rules'
import './Aide.css'
import {EXPLAIN_VARIABLE} from '../actions'
import References from './References'
import marked from '../engine/marked'

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

		let rule = findRuleByDottedName(explained),
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
