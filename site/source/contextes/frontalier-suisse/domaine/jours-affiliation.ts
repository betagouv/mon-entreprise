import { annéeDesRevenus } from './annee-de-simulation'

const MILLISECONDES_PAR_JOUR = 1000 * 60 * 60 * 24

const enUTC = (date: Date): number =>
	Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())

export const joursDansAnnée = (année: number): number =>
	(Date.UTC(année + 1, 0, 1) - Date.UTC(année, 0, 1)) / MILLISECONDES_PAR_JOUR

export const joursAffiliésDansAnnée = (
	dateAffiliation: Date,
	dateFinAffiliation?: Date
): number => {
	const année = annéeDesRevenus(dateAffiliation, dateFinAffiliation)
	const débutAnnée = Date.UTC(année, 0, 1)
	const finAnnée = Date.UTC(année, 11, 31)

	const début = Math.max(enUTC(dateAffiliation), débutAnnée)
	const fin = Math.min(
		dateFinAffiliation ? enUTC(dateFinAffiliation) : finAnnée,
		finAnnée
	)

	return Math.max(0, Math.round((fin - début) / MILLISECONDES_PAR_JOUR) + 1)
}
