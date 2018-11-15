import { hideControl, startConversation } from 'Actions/actions'
import withLanguage from 'Components/utils/withLanguage'
import { makeJsx } from 'Engine/evaluation'
import { createMarkdownDiv } from 'Engine/marked'
import { compose } from 'ramda'
import React from 'react'
import emoji from 'react-easy-emoji'
import { connect } from 'react-redux'
import './Controls.css'
import withColours from './utils/withColours'

function Controls({
	controls,
	startConversation,
	hideControl,
	foldedSteps,
	colours,
	hiddenControls
}) {
	if (!controls?.length) return null
	return (
		<div id="controlsBlock">
			<ul>
				{controls.map(({ level, test, message, solution, evaluated }) =>
					hiddenControls.includes(test) ? null : (
						<li
							key={test}
							className="control"
							style={{ background: colours.lightenColour(45) }}>
							{emoji(level == 'avertissement' ? '⚠️' : 'ℹ️')}
							<div className="controlText">
								{message && createMarkdownDiv(message)}
								{!message && (
									<span id="controlExplanation">{makeJsx(evaluated)}</span>
								)}
								{solution && !foldedSteps.includes(solution.cible) && (
									<div id="solution">
										{/*emoji('💡')*/}
										<button
											key={solution.cible}
											className="ui__ link-button"
											onClick={() => startConversation(solution.cible)}>
											{solution.texte}
										</button>
									</div>
								)}
							</div>
							<button
								className="hide"
								aria-label="close"
								onClick={() => hideControl(test)}>
								×
							</button>
						</li>
					)
				)}
			</ul>
		</div>
	)
}

export default compose(
	connect(
		(state, props) => ({
			foldedSteps: state.conversationSteps.foldedSteps,
			key: props.language,
			hiddenControls: state.hiddenControls
		}),
		dispatch => ({
			startConversation: cible => dispatch(startConversation(cible)),
			hideControl: id => dispatch(hideControl(id))
		})
	),
	withColours,
	withLanguage
)(Controls)
