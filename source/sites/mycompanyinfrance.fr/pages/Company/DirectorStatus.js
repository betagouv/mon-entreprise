/* @flow */
import { defineDirectorStatus } from 'Actions/companyStatusActions'
import React from 'react'
import { connect } from 'react-redux'
import { SkipButton } from 'Ui/Button'
import type { DirectorStatus } from 'Types/companyStatusTypes'

type Props = {
	defineDirectorStatus: (?DirectorStatus) => void
}
const DefineDirectorStatus = ({ defineDirectorStatus }: Props) => (
	<>
		<h2>Defining the director&apos;s status </h2>
		<p>
			This choice is important because it determines the type of Social Security
			scheme and coverage for which the director is eligible.
		</p>
		<ul>
			<li>
				<strong>Salaried employee:</strong> The company director joins and is
				covered by France’s general Social Security scheme. Social Security
				contributions are calculated on the basis of the executive&apos;s actual
				pay and are paid monthly. Although more expensive, this scheme offers
				full social protection (except unemployment).
			</li>
			<li>
				<strong>Self-employed:</strong> The company director joins and is
				covered by France’s self-employed scheme called « Sécurité sociale des
				indépendants ». Contributions due are generally calculated based on
				professional income as reported to the tax authorities. Although less
				expensive, this scheme provides basic social protection (additional
				options and private insurance are recommended).
			</li>
		</ul>
		<div className="ui__ answer-group">
			<button
				className="ui__ button"
				onClick={() => {
					defineDirectorStatus('SALARIED')
				}}>
				Salaried
			</button>
			<button
				className="ui__ button"
				onClick={() => {
					defineDirectorStatus('SELF_EMPLOYED')
				}}>
				Self-employed
			</button>
			<SkipButton onClick={() => defineDirectorStatus(null)} />
		</div>
	</>
)

export default connect(
	null,
	{ defineDirectorStatus }
)(DefineDirectorStatus)
