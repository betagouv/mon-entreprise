import { lazy, Suspense } from 'react'

import Loader from '@/components/utils/Loader'

/**
 * Les modèles du comparateur importent statiquement les règles de
 * `modele-social`, `modele-as` et `modele-ti`. Charger la page à la demande
 * évite de les télécharger dès la première visite, sur toutes les pages.
 */
const ComparateurDeStatuts = lazy(() =>
	import('./ComparateurDeStatuts').then(({ ComparateurDeStatuts }) => ({
		default: ComparateurDeStatuts,
	}))
)

export const ComparateurDeStatutsDifféré = () => (
	<Suspense fallback={<Loader />}>
		<ComparateurDeStatuts />
	</Suspense>
)
