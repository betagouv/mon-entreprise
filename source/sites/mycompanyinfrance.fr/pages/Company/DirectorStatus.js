/* @flow */
import { defineDirectorStatus } from 'Actions/companyStatusActions'
import React from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { SkipButton } from 'Ui/Button'
import type { DirectorStatus } from 'Types/companyStatusTypes'

type Props = {
	defineDirectorStatus: (?DirectorStatus) => void
}
const DefineDirectorStatus = ({ defineDirectorStatus }: Props) => (
	<>
		<Helmet>
			<title>Defining the director's status</title>
			<meta
				name="description"
				content="This choice is important because it determines the director's Social Security scheme and coverage. Each option has legal implications, and leads to a different status when creating your company in France"
			/>
		</Helmet>
		<h2>Defining the director&apos;s status </h2>
		<p>
			This choice is important because it determines the director's Social Security
			scheme and coverage.
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
