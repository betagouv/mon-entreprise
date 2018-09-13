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

function Controls({
	blockingInputControls,
	controls,
	startConversation,
	currentQuestion,
	foldedSteps
}) {
	let control =
		!blockingInputControls &&
		do {
			let relevantControls = reject(
				c => c.isInputControl && c.dottedName !== currentQuestion
			)(controls)

			relevantControls[0]
		}

	return (
		<div id="controlsBlock">
			{blockingInputControls && (
				<p className="blockingControl">{blockingInputControls[0].message}</p>
			)}
			<Spring
				to={{
					height: control ? 'auto' : 0,
					opacity: control ? 1 : 0
				}}
				delay={1200}
				native>
				{styles =>
					!control ? null : (
						<animated.div id="control" style={styles}>
							<div id="controlContent">
								{do {
									let { level, message, solution, evaluated } = control
									;<>
										<h3
											style={{
												borderBottomColor:
													level === 'avertissement' ? '#e67e22' : '#34495e'
											}}>
											{level === 'avertissement' ? 'Attention' : 'Information'}
										</h3>
										{message && createMarkdownDiv(message)}
										{!message && (
											<div id="controlExplanation">{makeJsx(evaluated)}</div>
										)}
										{solution &&
											!foldedSteps.includes(solution.cible) && (
												<div id="solution">
													{emoji('💡')}
													<button
														key={solution.cible}
														className="ui__ link-button"
														onClick={() => startConversation(solution.cible)}>
														{solution.texte}
													</button>
												</div>
											)}
									</>
								}}
							</div>
						</animated.div>
					)
				}
			</Spring>
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
)(Controls)
