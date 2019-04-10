import { hideControl, startConversation } from 'Actions/actions'
import { makeJsx } from 'Engine/evaluation'
import { createMarkdownDiv } from 'Engine/marked'
import { compose } from 'ramda'
import React from 'react'
import emoji from 'react-easy-emoji'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import animate from 'Ui/animate'
import './Controls.css'
import withColours from './utils/withColours'

function Controls({
	controls,
	startConversation,
	hideControl,
	foldedSteps,
	hiddenControls,
	t,
	inversionFail
}) {
	let messages = [
		...controls,
		...(inversionFail
			? [
					{
						message: t([
							'Le montant saisi est trop faible ou abouti à une situation impossible, essayez en un autre',
							'simulateurs.inversionFail'
						]),
						level: 'avertissement'
					}
			  ]
			: [])
	]
	if (!messages?.length) return null

	return (
		<div id="controlsBlock">
			<ul style={{ margin: 0, padding: 0 }}>
				{messages.map(({ level, test, message, solution, evaluated }) =>
					hiddenControls.includes(test) ? null : (
						<li key={test}>
							<animate.appear className="control">
								{emoji(level == 'avertissement' ? '⚠️' : 'ℹ️')}
								<div className="controlText ui__ card">
									{message ? (
										createMarkdownDiv(message)
									) : (
										<span id="controlExplanation">{makeJsx(evaluated)}</span>
									)}

									{solution && !foldedSteps.includes(solution.cible) && (
										<div>
											<button
												key={solution.cible}
												className="ui__ link-button"
												onClick={() => startConversation(solution.cible)}>
												{solution.texte}
											</button>
										</div>
									)}
									<button
										className="hide"
										aria-label="close"
										onClick={() => hideControl(test)}>
										×
									</button>
								</div>
							</animate.appear>
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
	withTranslation()
)(Controls)
