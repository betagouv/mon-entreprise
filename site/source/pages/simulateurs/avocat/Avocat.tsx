import { usePageMetadata } from '@/hooks/usePageMetadata'

import IndépendantBase from '../indépendant/IndépendantBase'
import { configAvocat } from '../profession-libérale/simulationConfig'
import { AvertissementAvocat } from './AvertissementAvocat'
import { avocatMetadata } from './metadata'

export function Avocat() {
	const metadata = usePageMetadata(avocatMetadata)

	return (
		<IndépendantBase
			metadata={metadata}
			simulation={configAvocat}
			avertissement={<AvertissementAvocat />}
		/>
	)
}
