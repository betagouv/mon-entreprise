import { usePageMetadata } from '@/hooks/usePageMetadata'

import IndépendantBase from '../indépendant/IndépendantBase'
import { configAuxiliaire } from '../profession-libérale/simulationConfig'
import { AvertissementAuxiliaireMédical } from './AvertissementAuxiliaireMédical'
import { auxiliaireMédicalMetadata } from './metadata'

export function AuxiliaireMédical() {
	const metadata = usePageMetadata(auxiliaireMédicalMetadata)

	return (
		<IndépendantBase
			metadata={metadata}
			simulation={configAuxiliaire}
			avertissement={<AvertissementAuxiliaireMédical />}
		/>
	)
}
