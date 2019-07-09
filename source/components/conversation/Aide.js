import { EXPLAIN_VARIABLE } from 'Actions/actions'
import { Markdown } from 'Components/utils/markdown'
import withColours from 'Components/utils/withColours'
import { findRuleByDottedName } from 'Engine/rules'
import { compose } from 'ramda'
import React from 'react'
import { connect } from 'react-redux'
import { flatRulesSelector } from 'Selectors/analyseSelectors'
import References from '../rule/References'
import './Aide.css'

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
)(function Aide({ flatRules, explained, stopExplaining, colours }) {
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
				<p>
					<Markdown source={`# ${rule.title} \n\n${text}`} />
				</p>
				{refs && (
					<div>
						<p>Pour en savoir plus: </p>
						<References refs={refs} />
					</div>
				)}
			</section>
		</div>
	)
})
