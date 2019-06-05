/* @flow */

import { goBackToPreviousQuestion } from 'Actions/companyStatusActions'
import { T } from 'Components'
import React from 'react'
import { connect } from 'react-redux'
type ownProps = {
	onSkip?: () => void
}

type Props = ownProps & {
	goBackToPreviousQuestion: () => void
}
export default (connect(
	null,
	{ goBackToPreviousQuestion }
)(({ goBackToPreviousQuestion, onSkip }: Props) => (
	<div className="ui__ answer-group">
		<button
			className="ui__ small simple skip button left"
			onClick={goBackToPreviousQuestion}>
			← <T>Précédent</T>
		</button>
		{onSkip && (
			<button onClick={onSkip} className={'ui__ simple skip button small'}>
				<T>Passer</T> →
			</button>
		)}
	</div>
)): React$ComponentType<ownProps>)
