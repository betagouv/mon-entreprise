import React from 'react'
import './Controls.css'
import emoji from 'react-easy-emoji'
import { connect } from 'react-redux'
import { startConversation } from 'Actions/actions'
import { animated, Spring } from 'react-spring'
import { makeJsx } from 'Engine/evaluation'
import { createMarkdownDiv } from 'Engine/marked'

function Controls({ blockingInputControls, controls, startConversation }) {
	let control = !blockingInputControls && controls?.[0]
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
				delay={2000}
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
										{solution && (
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
	(state, props) => ({ key: props.language }),
	{
		startConversation
	}
)(Controls)
