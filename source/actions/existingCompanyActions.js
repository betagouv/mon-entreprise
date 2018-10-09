/* @flow */
import { isNil } from 'ramda'
import type { SaveExistingCompanyDetailsAction } from 'Types/companyTypes'

const getCommuneByCodeInsee = function(codeInsee: string) {
	return fetch(
		`https://geo.api.gouv.fr/communes/${codeInsee}?fields=departement,region`
	).then(response => {
		return response.json()
	})
}
const getCommuneByCodePostal = function(codePostal: string) {
	return fetch(
		`https://geo.api.gouv.fr/communes?codePostal=${codePostal}&fields=departement,region`
	)
		.then(response => {
			return response.json()
		})
		.then(communes => {
			if (!communes || communes.length === 0) {
				throw new Error(
					`Pas de commune associée à ce code postal : ${codePostal}`
				)
			}
			if (communes.length > 1) {
				throw new Error(
					`Trop de communes associées à ce code postal : ${codePostal}`
				)
			}
			return communes[0]
		})
}

export const saveExistingCompanyDetails = (details: { [string]: string }) => (
	dispatch: SaveExistingCompanyDetailsAction => void
) => {
	let effectif = Number.parseInt(
		details.tranche_effectif_salarie_entreprise_centaine_pret,
		10
	)
	effectif = isNaN(effectif) ? null : effectif

	getCommuneByCodeInsee(details.departement + details.commune)
		.catch(err => {
			console.warn(err)
			return getCommuneByCodePostal(details.code_postal)
		})
		.catch(err => {
			console.warn(err)
			return null
		})
		.then(commune =>
			dispatch({
				type: 'SAVE_EXISTING_COMPANY_DETAILS',
				details: {
					siret: details.siret,
					...(!isNil(effectif) ? { effectif } : null),
					...(commune ? { localisation: commune } : null),
					apiDetails: details
				}
			})
		)
}
