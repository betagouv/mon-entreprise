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
	code: string
	codePostal: string
	nom: string
}

export type Commune = SearchCommune & {
	'taux du versement mobilité': number
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
				.map((codePostal) => ({ ...commune, codePostal }))
				.filter(({ codePostal }) => codePostal.startsWith(number))
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
	const commune: SearchCommune = { ...apiCommune, codePostal }
	const taux = await tauxVersementTransport(commune)
	if (taux === null) {
		return null
	}

	return {
		...commune,
		'taux du versement mobilité': taux,
	}
}

async function tauxVersementTransport(
	commune: SearchCommune
): Promise<number | null> {
	let codeCommune = commune.code
	// 1. Si c'est une commune à arrondissement, on récupère le bon code correspondant à l'arrondissement.
	//    Comme il n'y a pas d'API facile pour faire ça, on le fait à la mano

	// 1. a : PARIS
	if (codeCommune === '75056') {
		codeCommune = '751' + commune.codePostal.slice(-2)
	}
	// 1. b : LYON
	if (codeCommune === '69123') {
		codeCommune = '6938' + commune.codePostal.slice(-1)
	}
	// 1. c : MARSEILLE
	if (codeCommune === '13055') {
		codeCommune = '132' + commune.codePostal.slice(-2)
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
