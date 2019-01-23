/* @flow */

import { goBackToPreviousQuestion } from 'Actions/companyStatusActions'
import { T } from 'Components'
import React from 'react'
import { connect } from 'react-redux'
import { SkipButton } from 'Ui/Button'
type ownProps = {
	onSkip?: () => void
}

type Props = ownProps & {
	goBackToPreviousQuestion: () => void
}
export default connect(
	null,
	{ goBackToPreviousQuestion }
)(({ goBackToPreviousQuestion, onSkip }: Props) => (
	<div className="ui__ answer-group">
		<button
			className="ui__ simple skip button left"
			onClick={goBackToPreviousQuestion}>
			‹ <T>Précédent</T>
		</button>
		{onSkip && <SkipButton onClick={onSkip} />}
	</div>
))
