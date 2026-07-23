import { usePageMetadata } from '@/hooks/usePageMetadata'

import IndépendantBase from '../indépendant/IndépendantBase'
import { AvertissementCipav } from './AvertissementCipav'
import { cipavMetadata } from './metadata'
import { cipavSimulationConfig } from './simulationConfig'

export function Cipav() {
	const metadata = usePageMetadata(cipavMetadata)

	return (
		<IndépendantBase
			metadata={metadata}
			simulation={cipavSimulationConfig}
			avertissement={<AvertissementCipav />}
			conseillersEntreprisesVariant="professions_liberales"
		/>
	)
}
