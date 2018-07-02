/* @flow */
import React from 'react'
import { Trans } from 'react-i18next'
import { connect } from 'react-redux'
import { noUserInputSelector } from 'Selectors/analyseSelectors'
import { BlueButton } from './ui/Button'

type Props = {
	hidden: boolean,
	onClick: () => void
}
const ContinueButton = ({ hidden, onClick }: Props) =>
	!hidden && (
		<div>
			<BlueButton onClick={onClick}>
				<Trans>Continuer</Trans>
			</BlueButton>
		</div>
	)

export default connect(
	state => ({
		hidden: noUserInputSelector(state) || state.conversationStarted
	}),
	{
		onClick: () => ({ type: 'START_CONVERSATION' })
	}
)(ContinueButton)
