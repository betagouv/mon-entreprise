import { goToQuestion, hideControl } from 'Actions/actions'
import { makeJsx } from 'Engine/evaluation'
import { compose } from 'ramda'
import React from 'react'
import emoji from 'react-easy-emoji'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { analysisWithDefaultsSelector } from 'Selectors/analyseSelectors'
import animate from 'Ui/animate'
import './Controls.css'
import { Markdown } from './utils/markdown'
import withColours from './utils/withColours'

function Controls({
	controls,
	goToQuestion,
	hideControl,
	foldedSteps,
	hiddenControls,
	t,
	inversionFail
}) {
	if (!controls) {
		return null
	}
	let messages = [
		...controls,
		...(inversionFail
			? [
					{
						message: t([
							'simulateurs.inversionFail',
							'Le montant saisi est trop faible ou aboutit à une situation impossible, essayez en un autre'
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
						<animate.fromTop key={test}>
							<li key={test}>
								<div className="control">
									{emoji(level == 'avertissement' ? '⚠️' : 'ℹ️')}
									<div className="controlText ui__ card">
										{message ? (
											<Markdown source={message} />
										) : (
											<span id="controlExplanation">{makeJsx(evaluated)}</span>
										)}

										{solution && !foldedSteps.includes(solution.cible) && (
											<div>
												<button
													key={solution.cible}
													className="ui__ link-button"
													onClick={() => goToQuestion(solution.cible)}>
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
								</div>
							</li>
						</animate.fromTop>
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
			controls: analysisWithDefaultsSelector(state)?.controls,
			inversionFail: analysisWithDefaultsSelector(state)?.cache?.inversionFail,
			key: props.language,
			hiddenControls: state.simulation.hiddenControls
		}),
		{
			goToQuestion,
			hideControl
		}
	),
	withColours,
	withTranslation()
)(Controls)
