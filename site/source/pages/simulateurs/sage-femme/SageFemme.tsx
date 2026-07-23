import { usePageMetadata } from '@/hooks/usePageMetadata'

import IndépendantBase from '../indépendant/IndépendantBase'
import { configSageFemme } from '../profession-libérale/simulationConfig'
import { AvertissementSageFemme } from './AvertissementSageFemme'
import { sageFemmeMetadata } from './metadata'

export function SageFemme() {
	const metadata = usePageMetadata(sageFemmeMetadata)

	return (
		<IndépendantBase
			metadata={metadata}
			simulation={configSageFemme}
			avertissement={<AvertissementSageFemme />}
		/>
	)
}
