export const annéeDeSimulation = (): number => new Date().getFullYear()

export const annéeDesRevenus = (dateAffiliation: Date): number =>
	Math.max(annéeDeSimulation(), dateAffiliation.getFullYear())
