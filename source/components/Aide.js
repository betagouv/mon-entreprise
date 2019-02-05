import { EXPLAIN_VARIABLE } from 'Actions/actions'
import withColours from 'Components/utils/withColours'
import marked from 'Engine/marked'
import { findRuleByDottedName } from 'Engine/rules'
import { compose } from 'ramda'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { flatRulesSelector } from 'Selectors/analyseSelectors'
import './Aide.css'
import References from './rule/References'

export default compose(
	connect(
		state => ({
			explained: state.explainedVariable,
			flatRules: flatRulesSelector(state)
		}),
		dispatch => ({
			stopExplaining: () => dispatch({ type: EXPLAIN_VARIABLE })
		})
	),
	withColours
)(
	class Aide extends Component {
		renderExplanationMarkdown(explanation, term) {
			return marked(`### ${term} \n\n${explanation}`)
		}
		render() {
			let { flatRules, explained, stopExplaining, colours } = this.props

			if (!explained) return <section id="helpWrapper" />

			let rule = findRuleByDottedName(flatRules, explained),
				text = rule.description,
				refs = rule.références

			return (
				<div id="helpWrapper" className="active">
					<section id="help">
						<button
							id="closeHelp"
							onClick={stopExplaining}
							style={{ color: colours.colour }}>
							✖️
						</button>
						<p
							dangerouslySetInnerHTML={{
								__html: this.renderExplanationMarkdown(text, rule.title)
							}}
						/>
						{refs && (
							<div>
								<p>Pour en savoir plus: </p>
								<References refs={refs} />
							</div>
						)}
					</section>
				</div>
			)
		}
	}
)
