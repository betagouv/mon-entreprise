import { usePageMetadata } from '@/hooks/usePageMetadata'

import IndépendantBase from '../indépendant/IndépendantBase'
import { Avertissement } from './Avertissement'
import { professionLibéraleMetadata } from './metadata'
import { configProfessionLibérale } from './simulationConfig'

export function ProfessionLibérale() {
	const metadata = usePageMetadata(professionLibéraleMetadata)

	return (
		<IndépendantBase
			metadata={metadata}
			simulation={configProfessionLibérale}
			avertissement={<Avertissement />}
			conseillersEntreprisesVariant="professions_liberales"
		/>
	)
}
