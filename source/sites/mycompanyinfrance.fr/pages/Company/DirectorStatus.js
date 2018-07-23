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
			coverage for which the director is eligible.
		</p>
		<p>
			<strong> Salaried</strong> or <strong>self-employed</strong> ? The
			director’s Social Security coverage depends on the legal structure that
			has been chosen and the responsibilities led within it.
		</p>
		<ul>
			<li>
				<strong>Salaried employee:</strong> The company director joins and is
				covered by France’s general Social Security scheme. Social Security
				contributions are calculated on the basis of the executive&apos;s actual
				pay and are paid monthly.
			</li>
			<li>
				<strong>Self-employed:</strong> The company director joins and is
				covered by France’s self-employed scheme called « Sécurité sociale pour
				les indépendants ». Contributions due are generally calculated based on
				professional income as reported to the tax authorities.
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
