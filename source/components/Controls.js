import React from 'react'
import './Controls.css'
import emoji from 'react-easy-emoji'
import { connect } from 'react-redux'
import { startConversation } from 'Actions/actions'

function Controls({ blockingInputControls, controls, startConversation }) {
	return (
		<div id="controlsBlock">
			{blockingInputControls && (
				<p id="blockingControl">{blockingInputControls[0].message}</p>
			)}
			{!blockingInputControls &&
				controls.length > 0 && (
					<>
						{emoji('⚠️')}
						<ul id="controls">
							{controls.map(({ test, action }) => (
								<li key={test}>
									<p>{test}</p>
									{action && (
										<button
											key={action.cible}
											className="ui__ link-button"
											onClick={() => startConversation(action.cible)}>
											{action.texte}
										</button>
									)}
								</li>
							))}
						</ul>
					</>
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
