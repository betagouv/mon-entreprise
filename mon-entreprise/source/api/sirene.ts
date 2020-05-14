const isSIREN = (input: string) => /^[\s]*([\d][\s]*){9}$/.exec(input)
const isSIRET = (input: string) => /^[\s]*([\d][\s]*){14}$/.exec(input)

export async function fetchCompanyDetails(siren: string) {
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

export async function searchDenominationOrSiren(value: string) {
	if (isSIRET(value)) {
		value = value.replace(/[\s]/g, '').slice(0, 9)
	}
	if (isSIREN(value)) {
		return [{ siren: value }]
	}
	return searchFullText(value)
}

type SireneData = {
	etablissement: Array<{
		siren: string
		is_siege: string
		categorie_entreprise: string
		activite_principale: string
		l1_normalisee: string
	}>
}

export type Etablissement = {
	siren: string
	denomination?: string
}

async function searchFullText(
	text: string
): Promise<Array<Etablissement> | null> {
	const response = await fetch(
		`https://entreprise.data.gouv.fr/api/sirene/v1/full_text/${text}?per_page=5`
	)
	if (!response.ok) {
		return null
	}
	const json: SireneData = await response.json()
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
