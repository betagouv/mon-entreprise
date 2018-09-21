/* @flow */
import { companyHasMultipleAssociates } from 'Actions/companyStatusActions'
import React from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { SkipButton } from 'Ui/Button'

type Props = {
	companyHasMultipleAssociates: (?boolean) => void
}

const NumberOfAssociates = ({ companyHasMultipleAssociates }: Props) => (
	<>
		<Helmet>
			<title>Number of associate </title>
			<meta
				name="description"
				content="If your company only has one associate, the administrative process for creating your company in France is easier."
			/>
		</Helmet>
		<h2>Number of associates</h2>
		<p>
			If your company only has one associate, the administrative process is
			easier.
		</p>

		<div className="ui__ answer-group">
			<button
				onClick={() => {
					companyHasMultipleAssociates(false)
				}}
				className="ui__ button">
				Only one associate
			</button>
			<button
				onClick={() => {
					companyHasMultipleAssociates(true)
				}}
				className="ui__ button">
				More than one associate
			</button>
			<SkipButton onClick={() => companyHasMultipleAssociates(null)} />
		</div>
	</>
)

export default connect(
	null,
	{ companyHasMultipleAssociates }
)(NumberOfAssociates)
