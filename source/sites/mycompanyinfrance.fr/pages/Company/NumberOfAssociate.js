/* @flow */
import { companyHaveMultipleAssociates } from 'Actions/companyStatusActions'
import React from 'react'
import { connect } from 'react-redux'
import { SkipButton } from 'Ui/Button'

type Props = {
	companyHaveMultipleAssociates: (?boolean) => void
}

const NumberOfAssociate = ({ companyHaveMultipleAssociates }: Props) => (
	<>
		<h2>Number of associates</h2>
		<p>
			If your company only has one associate, the administrative process is
			easier.
		</p>

		<div className="ui__ answer-group">
			<button
				onClick={() => {
					companyHaveMultipleAssociates(false)
				}}
				className="ui__ button">
				Only one associate
			</button>
			<button
				onClick={() => {
					companyHaveMultipleAssociates(true)
				}}
				className="ui__ button">
				More than one associate
			</button>
			<SkipButton onClick={() => companyHaveMultipleAssociates(null)} />
		</div>
	</>
)

export default connect(
	null,
	{ companyHaveMultipleAssociates }
)(NumberOfAssociate)
