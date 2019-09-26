const isSIREN = input => input.match(/^[\s]*([\d][\s]*){9}$/)
const isSIRET = input => input.match(/^[\s]*([\d][\s]*){14}$/)

export async function fetchCompanyDetails(siren) {
	const response = await fetch(
		`https://entreprise.data.gouv.fr/api/sirene/v3/unites_legales/${siren.replace(
			/[\s]/g,
			''
		)}`
	)
	if (!response.ok) {
		return null
	}
	const json = await response.json()
	return json.unite_legale
}

export async function searchDenominationOrSiren(value) {
	if (isSIRET(value)) {
		value = value.replace(/[\s]/g, '').slice(0, 9)
	}
	if (isSIREN(value)) {
		return [{ siren: value }]
	}
	return searchFullText(value)
}

async function searchFullText(text) {
	const response = await fetch(
		`https://entreprise.data.gouv.fr/api/sirene/v1/full_text/${text}?per_page=5`
	)
	if (!response.ok) {
		return null
	}
	const json = await response.json()
	const etablissements = json.etablissement
		.filter(
			({ is_siege, categorie_entreprise, activite_principale }) =>
				categorie_entreprise !== 'ETI' &&
				is_siege === '1' &&
				activite_principale !== '8411Z'
		)
		.map(({ l1_normalisee, siren }) => ({
			denomination: l1_normalisee,
			siren
		}))
	if (!etablissements.length) {
		return null
	}
	return etablissements
}
