const MILLISECONDES_PAR_JOUR = 1000 * 60 * 60 * 24

const enUTC = (date: Date): number =>
	Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())

export const joursDansAnnée = (année: number): number =>
	(Date.UTC(année + 1, 0, 1) - Date.UTC(année, 0, 1)) / MILLISECONDES_PAR_JOUR

/**
 * Nombre de jours d'affiliation au cours de l'année d'affiliation :
 * du jour d'affiliation, inclus, au 31 décembre de cette même année, inclus.
 */
export const nombreDeJoursAffiliation = (dateAffiliation: Date): number => {
	const finAnnée = Date.UTC(dateAffiliation.getFullYear(), 11, 31)

	return (
		Math.round((finAnnée - enUTC(dateAffiliation)) / MILLISECONDES_PAR_JOUR) + 1
	)
}
