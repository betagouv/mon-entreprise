export type Références = Record<string, string>

// La BPI a accepté d'utiliser notre assistant sur son site, à condition de ne
// montrer que les liens pertinents pour ses usagers. Elle a payé le surcoût de
// développement correspondant.
const SITES_PARTENAIRES_BPI = ['bpifrance-creation.fr', 'associations.gouv.fr']

const estUnSitePartenaireBPI = (lien: string) =>
	SITES_PARTENAIRES_BPI.some((site) => lien.includes(site))

export const référencesÀAfficher = (
	références: Références | undefined,
	embarquéSurLeSiteBPI: boolean
): Références =>
	Object.fromEntries(
		Object.entries(références ?? {}).filter(
			([, lien]) => estUnSitePartenaireBPI(lien) === embarquéSurLeSiteBPI
		)
	)
