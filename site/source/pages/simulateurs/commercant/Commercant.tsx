import { usePageMetadata } from '@/hooks/usePageMetadata'

import IndépendantBase from '../indépendant/IndépendantBase'
import { commerçantMetadata } from './metadata'
import { configCommerçant } from './simulationConfig'

export function Commerçant() {
	const metadata = usePageMetadata(commerçantMetadata)

	return (
		<IndépendantBase
			metadata={metadata}
			simulation={configCommerçant}
			conseillersEntreprisesVariant="revenus_par_statut"
		/>
	)
}
