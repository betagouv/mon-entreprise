import { environnement } from '@/services/environnement/environnement'

/**
 * Indique si le calcul des cotisations est activé en économie collaborative
 * - false : seule l'applicabilité des régimes est affichée (v1)
 * - true : calcul complet des cotisations affichées (v2)
 */
export const isCotisationsEnabled =
	environnement.features.économieCollaborative.afficherLesCotisations
