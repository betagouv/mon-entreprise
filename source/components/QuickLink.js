/* @flow */
import { startConversation } from 'Actions/actions'
import React from 'react'
import { Trans } from 'react-i18next'
import { connect } from 'react-redux'
type Props = {
	startConversation: (?string) => void
}
const QuickLink = ({ startConversation }: Props) => (
	<>
		<button
			className="ui__ link-button"
			onClick={() => startConversation('contrat salarié . type de contrat')}>
			<Trans>CDI</Trans>
		</button>
		<button
			className="ui__ link-button"
			onClick={() => startConversation('contrat salarié . type de contrat')}>
			<Trans>CDD</Trans>
		</button>
		<button
			className="ui__ link-button"
			onClick={() => startConversation('contrat salarié . statut cadre')}>
			<Trans>Cadre</Trans>
		</button>
		<button
			className="ui__ link-button"
			onClick={() => startConversation('contrat salarié . temps partiel')}>
			<Trans>Temps partiel</Trans>
		</button>
		<button className="ui__ link-button" onClick={() => startConversation()}>
			<Trans>Autres</Trans>
		</button>
	</>
)
export default connect(
	null,
	{
		startConversation
	}
)(QuickLink)
