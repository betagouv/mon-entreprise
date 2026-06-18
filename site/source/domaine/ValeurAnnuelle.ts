/**
 * Représente une valeur qui change chaque année (seuils, plafonds, taux...)
 */
export type ValeurAnnuelle<T> = Readonly<Record<number, T>>

/**
 * Retourne la valeur pour l'année demandée, ou la dernière valeur disponible
 * si cette année n'est pas renseignée.
 */
export const valeurPourAnnée = <T>(
	valeurs: ValeurAnnuelle<T>,
	année: number
): T => {
	if (année in valeurs) {
		return valeurs[année]
	}

	const dernièreAnnée = Math.max(...Object.keys(valeurs).map(Number))

	return valeurs[dernièreAnnée]
}

/**
 * Retourne la valeur pour l'année courante, ou la dernière valeur disponible
 * si l'année courante n'est pas encore renseignée.
 */
export const valeurCourante = <T>(valeurs: ValeurAnnuelle<T>): T =>
	valeurPourAnnée(valeurs, new Date().getFullYear())
