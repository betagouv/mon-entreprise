/**
 * Représente une valeur qui change chaque année (seuils, plafonds, taux...)
 */
export type ValeurAnnuelle<T> = Readonly<Record<number, T>>

/**
 * Retourne la valeur en vigueur pour l'année demandée : celle de l'année la plus
 * récente qui lui est antérieure ou égale, ou la plus ancienne connue si l'année
 * précède la table.
 */
export const valeurPourAnnée = <T>(
	valeurs: ValeurAnnuelle<T>,
	année: number
): T => {
	const annéesConnues = Object.keys(valeurs).map(Number)
	const annéesEnVigueur = annéesConnues.filter((connue) => connue <= année)

	const annéeApplicable =
		annéesEnVigueur.length > 0
			? Math.max(...annéesEnVigueur)
			: Math.min(...annéesConnues)

	return valeurs[annéeApplicable]
}

/**
 * Retourne la valeur pour l'année courante, ou la dernière valeur disponible
 * si l'année courante n'est pas encore renseignée.
 */
export const valeurCourante = <T>(valeurs: ValeurAnnuelle<T>): T =>
	valeurPourAnnée(valeurs, new Date().getFullYear())
