import { usePageMetadata } from '@/hooks/usePageMetadata'

import IndépendantBase from '../indépendant/IndépendantBase'
import { configExpertComptable } from '../profession-libérale/simulationConfig'
import { AvertissementExpertComptable } from './AvertissementExpertComptable'
import { expertComptableMetadata } from './metadata'

export function ExpertComptable() {
	const metadata = usePageMetadata(expertComptableMetadata)

	return (
		<IndépendantBase
			metadata={metadata}
			simulation={configExpertComptable}
			avertissement={<AvertissementExpertComptable />}
		/>
	)
}
