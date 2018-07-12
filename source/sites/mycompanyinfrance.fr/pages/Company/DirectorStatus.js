/* @flow */
import { defineDirectorStatus } from 'Actions/companyStatusActions'
import { equals } from 'ramda'
import React from 'react'
import { connect } from 'react-redux'
import { disabledDirectorStatusSelector } from 'Selectors/companyStatusSelectors'
import { SkipButton } from 'Ui/Button'
import type { DirectorStatus } from 'Types/companyStatusTypes'
import type { RouterHistory } from 'react-router'
type Props = {
	history: RouterHistory,
	defineDirectorStatus: DirectorStatus => void,
	disabledDirectorStatus: Array<DirectorStatus>
}

const goToNextStep = (history: RouterHistory) => {
	history.push('/my-company/set-legal-status')
}

const DefineDirectorStatus = ({
	history,
	defineDirectorStatus,
	disabledDirectorStatus
}: Props) => (
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
		{!!disabledDirectorStatus.length && (
			<p>
				Because of your previous choices, you only have the following
				possibility for the director status:
			</p>
		)}
		<div className="ui__ answer-group">
			{!disabledDirectorStatus.find(equals('SALARIED')) && (
				<button
					className="ui__ button"
					onClick={() => {
						defineDirectorStatus('SALARIED')
						goToNextStep(history)
					}}>
					Salaried
				</button>
			)}
			{!disabledDirectorStatus.find(equals('SELF-EMPLOYED')) && (
				<button
					className="ui__ button"
					onClick={() => {
						defineDirectorStatus('SELF_EMPLOYED')
						goToNextStep(history)
					}}>
					Self-employed
				</button>
			)}
			<SkipButton onClick={() => goToNextStep(history)} />
		</div>
	</>
)

export default connect(
	state => ({ disabledDirectorStatus: disabledDirectorStatusSelector(state) }),
	{ defineDirectorStatus }
)(DefineDirectorStatus)
