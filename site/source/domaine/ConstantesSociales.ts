import { ValeurAnnuelle } from './ValeurAnnuelle'

/**
 * @mise-à-jour-annuelle
 * Plafond Annuel de la Sécurité Sociale (PASS)
 * Source : https://www.urssaf.fr/accueil/outils-documentation/taux-baremes/plafonds-securite-sociale.html
 */
export const PLAFOND_ANNUEL_SECURITE_SOCIALE: ValeurAnnuelle<number> = {
	2024: 46_368,
	2025: 47_100,
} as const

export const PASS = PLAFOND_ANNUEL_SECURITE_SOCIALE
