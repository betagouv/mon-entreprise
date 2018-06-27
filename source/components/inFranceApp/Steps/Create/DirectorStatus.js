/* @flow */
import React from 'react'
import { connect } from 'react-redux'
import { defineDirectorStatus } from '../../actions'
import { SkipButton } from '../../ui/Button'
import type { DirectorStatus } from '../../types'
import type { RouterHistory } from 'react-router'
type Props = {
	history: RouterHistory,
	defineDirectorStatus: DirectorStatus => void
}

const goToNextStep = (history: RouterHistory) => {
	history.push('/create-my-company/number-of-associate')
}

const DefineDirectorStatus = ({ history, defineDirectorStatus }: Props) => (
	<>
		<h2>Defining the director&apos;s status </h2>
		<p>
			This choice is important because it determines the type of Social Security
			coverage for which the director is eligible.
		</p>
		<p>
			<strong> Salaried</strong> or <strong>self-employed</strong> ? The
			director’s Social Security coverage depends on the legal structure that
			has been chosen and the responsibilities she/he has within it.
		</p>
		<ul>
			<li>
				<strong>Salaried employee:</strong> The company director joins and is
				covered by France’s general Social Security scheme. Social Security
				contributions are calculated on the basis of the executive&apos;s actual
				pay and are paid monthly or quarterly.
			</li>
			<li>
				<strong>Self-employed:</strong> The company director joins and is
				covered by France’s self-employed scheme called « Sécurité sociale des
				indépendants ». Contributions due are generally calculated based on
				employment income as reported to the tax authorities.
			</li>
		</ul>

		<div className="ui__ answer-group">
			<button
				className="ui__ button"
				onClick={() => {
					defineDirectorStatus('SALARIED')
					goToNextStep(history)
				}}>
				Salaried
			</button>
			<button
				className="ui__ button"
				onClick={() => {
					defineDirectorStatus('SELF_EMPLOYED')
					goToNextStep(history)
				}}>
				Self-employed
			</button>
			<SkipButton onClick={() => goToNextStep(history)} />
		</div>
	</>
)

export default connect(
	null,
	{ defineDirectorStatus }
)(DefineDirectorStatus)
