import React from 'react'
import './Controls.css'
import emoji from 'react-easy-emoji'
import { connect } from 'react-redux'
import { startConversation } from 'Actions/actions'

function Controls({ blockingInputControls, controls, startConversation }) {
	return (
		<div>
			{blockingInputControls && (
				<p className="controls">{blockingInputControls[0].message}</p>
			)}
			{!blockingInputControls &&
				controls.length > 0 && (
					<>
						{emoji('⚠️')}
						<ul className="controls">
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
