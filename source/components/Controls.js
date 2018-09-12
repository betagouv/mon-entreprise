import React from 'react'
import './Controls.css'
import emoji from 'react-easy-emoji'
import { connect } from 'react-redux'
import { startConversation } from 'Actions/actions'
import { animated, Spring } from 'react-spring'
import { makeJsx } from 'Engine/evaluation'

function Controls({ blockingInputControls, controls, startConversation }) {
	return (
		<div id="controlsBlock">
			{blockingInputControls && (
				<p className="blockingControl">{blockingInputControls[0].message}</p>
			)}
			{!blockingInputControls && (
				<Spring
					to={{
						height: controls?.length ? 'auto' : 0,
						opacity: controls?.length ? 1 : 0
					}}
					native>
					{styles =>
						controls?.length ? (
							<animated.div id="control" style={styles}>
								<div id="controlContent">
									{do {
										let { level, solution, evaluated } = controls[0]
										;<>
											<h3
												style={{
													borderBottomColor:
														level === 'avertissement' ? '#e67e22' : '#34495e'
												}}>
												{level === 'avertissement'
													? 'Attention'
													: 'Information'}
											</h3>
											<p id="controlExplanation">{makeJsx(evaluated)}</p>
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
						) : null
					}
				</Spring>
			)}
		</div>
	)
}

export default connect(
	(state, props) => ({ key: props.language }),
	{
		startConversation
	}
)(Controls)
