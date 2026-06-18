export const annéeDeSimulation = (): number => new Date().getFullYear()

/**
 * Année pour laquelle on estime la cotisation : l'année en cours, ou l'année
 * d'affiliation si celle-ci est dans le futur (on simule alors sa première année).
 */
export const annéeDeCotisation = (dateAffiliation: Date): number =>
	Math.max(annéeDeSimulation(), dateAffiliation.getFullYear())
