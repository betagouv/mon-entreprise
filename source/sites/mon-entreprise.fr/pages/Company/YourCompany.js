/* @flow */

import { React, T } from 'Components'
import withSitePaths from 'Components/utils/withSitePaths'
import { compose, toPairs } from 'ramda'
import { useTranslation, withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import type { ResetExistingCompanyDetailsAction } from 'Types/companyTypes'
import type { TFunction } from 'react-i18next'

let companyDataSelection = t => ({
	l1_normalisee: t('Nom'),
	libelle_activite_principale: t('Activité principale'),
	l4_normalisee: t('Adresse'),
	l6_normalisee: t('Ville'),
	libelle_region: t('Région'),
	libelle_tranche_effectif_salarie_entreprise: t("Nombre d'employés"),
	date_creation: t('Date de création')
})

const YYYYMMDDToDate = (date: string): Date =>
	new Date(date.replace(/^([\d]{4})([\d]{2})([\d]{2})$/, '$1/$2/$3'))

type LocaleDateProps = {
	date: Date,
	options?: { [string]: string }
}
const LocaleDate = withTranslation(({ date, options, i18n }: LocaleDateProps) =>
	new Intl.DateTimeFormat(i18n.language, {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
		...options
	}).format(date)
)

export const CompanyDetails = (data: { [string]: string }) => {
	const { t } = useTranslation()
	const localizedCompanyDataSelection = companyDataSelection(t)
	return (
		<ul>
			{toPairs(data).map(([key, value]) =>
				localizedCompanyDataSelection[key] != null ? (
					<li key={key}>
						<strong>{localizedCompanyDataSelection[key]}</strong>
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

const YourCompany = ({ companyDetails, resetCompanyDetails, sitePaths }) => (
	<>
		{!companyDetails && <Redirect to={sitePaths.entreprise.index} />}
		<h1>
			<T>Mon entreprise</T>
		</h1>
		<CompanyDetails {...companyDetails.apiDetails} />
		<p>
			<Link onClick={resetCompanyDetails} to={sitePaths.entreprise.trouver}>
				<T>Ce n'est pas mon entreprise</T>
			</Link>
		</p>
		<p>
			<Link to={sitePaths.sécuritéSociale.index} className="ui__ button">
				<T>Simuler mes cotisations</T>
			</Link>
		</p>
	</>
)

export default compose(
	withSitePaths,
	connect(
		state => ({
			companyDetails: state.inFranceApp.existingCompanyDetails
		}),
		(dispatch: ResetExistingCompanyDetailsAction => void) => ({
			resetCompanyDetails: () =>
				dispatch({
					type: 'RESET_EXISTING_COMPANY_DETAILS'
				})
		})
	)
)(YourCompany)
