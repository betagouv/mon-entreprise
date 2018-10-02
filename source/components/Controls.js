import React from 'react'
import './Controls.css'
import emoji from 'react-easy-emoji'
import { connect } from 'react-redux'
import { startConversation } from 'Actions/actions'
import { animated, Spring } from 'react-spring'
import { makeJsx } from 'Engine/evaluation'
import { createMarkdownDiv } from 'Engine/marked'
import { currentQuestionSelector } from '../selectors/analyseSelectors'
import { reject } from 'ramda'
import withColours from './utils/withColours'

function Controls({
	blockingInputControls,
	controls,
	startConversation,
	currentQuestion,
	foldedSteps,
	colours
}) {
	return (
		<div id="controlsBlock">
			{blockingInputControls && (
				<p className="blockingControl">{blockingInputControls[0].message}</p>
			)}
			{!blockingInputControls && (
				<>
					<ul>
						{controls.map(control => (
							<li
								key={control.si}
								className="control"
								style={{ background: colours.lightenColour(45) }}>
								{do {
									let { level, message, solution, evaluated } = control
									;<>
										{emoji(level == 'avertissement' ? '⚠️' : 'ℹ️')}
										<div className="controlText">
											{message && createMarkdownDiv(message)}
											{!message && (
												<span id="controlExplanation">
													{makeJsx(evaluated)}
												</span>
											)}
											{solution &&
												!foldedSteps.includes(solution.cible) && (
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
									</>
								}}
							</li>
						))}
					</ul>
				</>
			)}
		</div>
	)
}

export default connect(
	(state, props) => ({
		currentQuestion: currentQuestionSelector(state),
		foldedSteps: state.conversationSteps.foldedSteps,
		key: props.language
	}),
	{
		startConversation
	}
)(withColours(Controls))
