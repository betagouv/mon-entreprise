import { usePageMetadata } from '@/hooks/usePageMetadata'

import IndépendantBase from '../indépendant/IndépendantBase'
import { artisanMetadata } from './metadata'
import { configArtisan } from './simulationConfig'

export function Artisan() {
	const metadata = usePageMetadata(artisanMetadata)

	return (
		<IndépendantBase
			metadata={metadata}
			simulation={configArtisan}
			conseillersEntreprisesVariant="revenus_par_statut"
		/>
	)
}
