import { usePageMetadata } from '@/hooks/usePageMetadata'

import IndépendantBase from '../indépendant/IndépendantBase'
import { configMédecin } from '../profession-libérale/simulationConfig'
import { AvertissementMédecin } from './AvertissementMédecin'
import { médecinMetadata } from './metadata'

export function Médecin() {
	const metadata = usePageMetadata(médecinMetadata)

	return (
		<IndépendantBase
			metadata={metadata}
			simulation={configMédecin}
			avertissement={<AvertissementMédecin />}
			conseillersEntreprisesVariant="professions_liberales"
		/>
	)
}
