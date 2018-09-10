/* @flow */
import { goToCompanyStatusChoice } from 'Actions/companyStatusActions'
import { isNil } from 'ramda'
import React from 'react'
import { connect } from 'react-redux'
import { capitalise0 } from '../../../../utils'
import type { CompanyLegalStatus } from 'Types/companyStatusTypes'

const requirementToText = (key, value) => {
	if (typeof value === 'string') {
		return capitalise0(value.toLowerCase().replace('_', ' '))
	}
	if (typeof value === 'boolean') {
		return capitalise0(
			key.replace(/([A-Z]+)*([A-Z][a-z])/g, '$1 $2').toLowerCase()
		)
	}
	return null
}

type Props = CompanyLegalStatus & { goToCompanyStatusChoice: () => void }

const LegalStatusChoice = ({
	goToCompanyStatusChoice,
	...legalStatus
}: Props) => {
	return (
		!!Object.keys(legalStatus).length && (
			<>
				<h2>My answers</h2>
				<p>
					<button
						className="ui__ link-button"
						onClick={goToCompanyStatusChoice}>
						Reset
					</button>
				</p>
				<ul>
					{Object.entries(legalStatus).map(
						([key, value]) =>
							!isNil(value) && (
								<li key={key}>{requirementToText(key, value)}</li>
							)
					)}
				</ul>
			</>
		)
	)
}

export default connect(
	state => state.inFranceApp.companyLegalStatus,
	{ goToCompanyStatusChoice }
)(LegalStatusChoice)
