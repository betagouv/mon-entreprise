/**
 * Indique si le calcul des cotisations est activé en économie collaborative
 * - false : seule l'applicabilité des régimes est affichée (v1)
 * - true : calcul complet des cotisations affichées (v2)
 */
export const isCotisationsEnabled =
	import.meta.env.VITE_ENABLE_ECONOMIE_COLLABORATIVE_COTISATIONS === 'true'