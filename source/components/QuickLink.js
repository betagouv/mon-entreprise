/* @flow */
import { startConversation } from 'Actions/actions'
import React from 'react'
import { connect } from 'react-redux'
type Props = {
	startConversation: (?string) => void
}
const QuickLink = ({ startConversation }: Props) => (
	<>
		<button
			className="ui__ link-button"
			onClick={() => startConversation('contrat salarié . type de contrat')}>
			Permanent
		</button>
		<button
			className="ui__ link-button"
			onClick={() => startConversation('contrat salarié . type de contrat')}>
			Fixed-term
		</button>
		<button
			className="ui__ link-button"
			onClick={() => startConversation('contrat salarié . statut cadre')}>
			"Cadre" status
		</button>
		<button
			className="ui__ link-button"
			onClick={() => startConversation('contrat salarié . temps partiel')}>
			Part time
		</button>
		<button className="ui__ link-button" onClick={() => startConversation()}>
			Other situations
		</button>
	</>
)
export default connect(
	null,
	{
		startConversation
	}
)(QuickLink)
