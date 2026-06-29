export const annéeDeSimulation = (): number => new Date().getFullYear()

export const annéeDesRevenus = (
	dateAffiliation: Date,
	dateFinAffiliation?: Date
): number => {
	const minimum = dateAffiliation.getFullYear()
	const maximum = dateFinAffiliation?.getFullYear() ?? Infinity

	return Math.min(Math.max(annéeDeSimulation(), minimum), maximum)
}
