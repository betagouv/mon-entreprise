/* @flow */

import { React, T } from 'Components'
import withLanguage from 'Components/utils/withLanguage'
import { toPairs } from 'ramda'
import { connect } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import sitePaths from '../../sitePaths'
import type { ResetExistingCompanyDetailsAction } from 'Types/companyTypes'

let companyDataSelection = {
	l1_normalisee: 'Name',
	libelle_activite_principale: 'Main activity',
	l4_normalisee: 'Street',
	l6_normalisee: 'City',
	libelle_region: 'Region',
	libelle_tranche_effectif_salarie_entreprise: 'Number of employees',
	date_creation: 'Creation date'
}

const YYYYMMDDToDate = (date: string): Date =>
	new Date(date.replace(/^([\d]{4})([\d]{2})([\d]{2})$/, '$1/$2/$3'))

type LocaleDateProps = {
	date: Date,
	options?: { [string]: string },
	language: string
}
const LocaleDate = withLanguage(
	({ date, options, language }: LocaleDateProps) =>
		new Intl.DateTimeFormat(language, {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			...options
		}).format(date)
)

export const CompanyDetails = (data: { [string]: string }) => {
	return (
		<ul>
			{toPairs(data).map(
				([key, value]) =>
					companyDataSelection[key] != null ? (
						<li key={key}>
							<strong>{companyDataSelection[key]}</strong>
							<br />
							{key === 'date_creation' ? (
								<LocaleDate date={YYYYMMDDToDate(value)} />
							) : (
								value
							)}
						</li>
					) : null
			)}
		</ul>
	)
}

const YourCompany = ({ companyDetails, resetCompanyDetails }) => (
	<>
		{!companyDetails && <Redirect to={sitePaths().entreprise.index} />}
		<h1>
			<T>Your company</T>
		</h1>
		<CompanyDetails {...companyDetails.apiDetails} />
		<p>
			<Link onClick={resetCompanyDetails} to={sitePaths().entreprise.trouver}>
				This is not my company
			</Link>
		</p>
		<p>
			<Link to={sitePaths().sécuritéSociale.index} className="ui__ button">
				Simulate hiring costs
			</Link>
		</p>
	</>
)

export default connect(
	state => ({
		companyDetails: state.inFranceApp.existingCompanyDetails
	}),
	(dispatch: ResetExistingCompanyDetailsAction => void) => ({
		resetCompanyDetails: () =>
			dispatch({
				type: 'RESET_EXISTING_COMPANY_DETAILS'
			})
	})
)(YourCompany)
