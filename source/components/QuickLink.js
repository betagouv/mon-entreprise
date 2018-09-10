/* @flow */
import { startConversation } from 'Actions/actions'
import withLanguage from 'Components/utils/withLanguage'
import { toPairs, compose } from 'ramda'
import React from 'react'
import { Trans } from 'react-i18next'
import { connect } from 'react-redux'
type Props = {
	startConversation: (?string) => void
}

let quickLinks = {
	CDD: 'contrat salarié . type de contrat',
	CDI: 'contrat salarié . type de contrat',
	Cadre: 'contrat salarié . statut cadre',
	'Temps partiel': 'contrat salarié . temps partiel',
	Autres: null
}

const QuickLink = ({ startConversation }: Props) => (
	<>
		{toPairs(quickLinks).map(([label, dottedName]) => (
			<button
				key={label}
				className="ui__ link-button"
				onClick={() => startConversation(dottedName)}>
				<Trans>{label}</Trans>
			</button>
		))}
	</>
)
export default compose(
	withLanguage,
	connect(
		(state, props) => ({ key: props.language }),
		{
			startConversation
		}
	)
)(QuickLink)
