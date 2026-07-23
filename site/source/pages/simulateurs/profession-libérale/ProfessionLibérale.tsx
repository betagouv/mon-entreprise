import { usePageMetadata } from '@/hooks/usePageMetadata'

import IndépendantBase from '../indépendant/IndépendantBase'
import { AvertissementProfessionLibérale } from './AvertissementProfessionLibérale'
import { professionLibéraleMetadata } from './metadata'
import { configProfessionLibérale } from './simulationConfig'

export function ProfessionLibérale() {
	const metadata = usePageMetadata(professionLibéraleMetadata)

	return (
		<IndépendantBase
			metadata={metadata}
			simulation={configProfessionLibérale}
			avertissement={<AvertissementProfessionLibérale />}
			conseillersEntreprisesVariant="professions_liberales"
		/>
	)
}
