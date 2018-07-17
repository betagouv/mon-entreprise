/* @flow */
import { companyHaveMultipleAssociate } from 'Actions/companyStatusActions'
import React from 'react'
import { connect } from 'react-redux'
import { SkipButton } from 'Ui/Button'
import type { RouterHistory } from 'react-router'

type Props = {
	history: RouterHistory,
	companyHaveMultipleAssociate: boolean => void
}

const goToNextStep = (history: RouterHistory) => {
	history.push('/register/define-director-status')
}

const NumberOfAssociate = ({
	history,
	companyHaveMultipleAssociate
}: Props) => (
	<>
		<h2>Number of associates </h2>
		<p>
			If your company only have one associate, the administrative process is
			easier.
		</p>

		<div className="ui__ answer-group">
			<button
				onClick={() => {
					companyHaveMultipleAssociate(false)
					goToNextStep(history)
				}}
				className="ui__ button">
				Only one associate
			</button>
			<button
				onClick={() => {
					companyHaveMultipleAssociate(true)
					goToNextStep(history)
				}}
				className="ui__ button">
				Multiple partners
			</button>
			<SkipButton onClick={() => goToNextStep(history)} />
		</div>
	</>
)

export default connect(
	null,
	{ companyHaveMultipleAssociate }
)(NumberOfAssociate)
