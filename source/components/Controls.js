import React from 'react'
import './Controls.css'
import emoji from 'react-easy-emoji'
import { connect } from 'react-redux'
import { startConversation } from 'Actions/actions'
import { animated, Spring } from 'react-spring'

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
								{emoji('⚠️')}
								<div id="controlContent">
									{do {
										let { test, action } = controls[0]
										;<>
											<p>{test}</p>
											{action && (
												<button
													key={action.cible}
													className="ui__ link-button"
													onClick={() => startConversation(action.cible)}>
													{action.texte}
												</button>
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
