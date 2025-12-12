/**
 * Représente une valeur qui change chaque année (seuils, plafonds, taux...)
 */
export type ValeurAnnuelle<T> = Readonly<Record<number, T>>

/**
 * Retourne la valeur pour l'année courante, ou la dernière valeur disponible
 * si l'année courante n'est pas encore renseignée.
 */
export const valeurCourante = <T>(valeurs: ValeurAnnuelle<T>): T => {
	const annéeCourante = new Date().getFullYear()

	if (annéeCourante in valeurs) {
		return valeurs[annéeCourante]
	}

	const dernièreAnnée = Math.max(...Object.keys(valeurs).map(Number))

	return valeurs[dernièreAnnée]
}
