export type ApiCommuneJson = {
	_score: number
	code: string
	codesPostaux: Array<string>
	departement: {
		code: string
		nom: string
	}
	nom: string
	region: {
		code: string
		nom: string
	}
}

export type SearchCommune = {
	'code commune': string
	'code postal': string
	nom: string
	département: string
}

export type Commune = Omit<SearchCommune, 'code commune'> & {
	'taux versement mobilité': number
}

export async function searchCommunes(
	input: string
): Promise<Array<SearchCommune> | null> {
	const number = /[\d]+/.exec(input)?.join('') ?? ''
	const text = /[^\d]+/.exec(input)?.join(' ') ?? ''
	const response = await fetch(
		`https://geo.api.gouv.fr/communes?fields=nom,code,departement,region,codesPostaux${
			text ? `&nom=${text}` : ''
		}${/[\d]{5}/.exec(number) ? `&codePostal=${number}` : ''}&boost=population`
	)
	if (!response.ok) {
		return null
	}
	const json = (await response.json()) as Array<ApiCommuneJson>

	return json
		.flatMap(({ codesPostaux, ...commune }) =>
			codesPostaux
				.sort()
				.map((codePostal) => ({
					'code commune': commune.code,
					nom: commune.nom,
					'code postal': codePostal,
					département: commune.departement.nom,
				}))
				.filter(({ 'code postal': codePostal }) =>
					codePostal.startsWith(number)
				)
		)
		.slice(0, 10)
}

export async function fetchCommuneDetails(
	codeCommune: string,
	codePostal: string
): Promise<Commune | null> {
	const response = await fetch(
		`https://geo.api.gouv.fr/communes/${codeCommune}?fields=nom,code,departement,region,codesPostaux`
	)
	if (!response.ok) {
		return null
	}
	const apiCommune = (await response.json()) as ApiCommuneJson
	if (!apiCommune.codesPostaux.includes(codePostal)) {
		throw new Error(
			'Le code postal et le code commune fournis sont incompatibles'
		)
	}

	const taux = await tauxVersementTransport(apiCommune.code, codePostal)
	if (taux === null) {
		return null
	}

	return {
		'taux versement mobilité': taux,
		nom: apiCommune.nom,
		'code postal': codePostal,
		département: apiCommune.departement.nom,
	}
}

async function tauxVersementTransport(
	codeCommune: string,
	codePostal: string
): Promise<number | null> {
	// 1. Si c'est une commune à arrondissement, on récupère le bon code correspondant à l'arrondissement.
	//    Comme il n'y a pas d'API facile pour faire ça, on le fait à la mano

	// 1. a : PARIS
	if (codeCommune === '75056') {
		codeCommune = '751' + codePostal.slice(-2)
	}
	// 1. b : LYON
	if (codeCommune === '69123') {
		codeCommune = '6938' + codePostal.slice(-1)
	}
	// 1. c : MARSEILLE
	if (codeCommune === '13055') {
		codeCommune = '132' + codePostal.slice(-2)
	}
	// 2. On récupère le versement transport associé
	const response = await fetch('/data/versement-mobilité.json')
	if (!response.ok) {
		// eslint-disable-next-line no-console
		console.error(response)

		return 0
	}
	const json =
		(await response.json()) as typeof import('@/public/data/versement-mobilité.json')

	return json[codeCommune as keyof typeof json] ?? 0
}
