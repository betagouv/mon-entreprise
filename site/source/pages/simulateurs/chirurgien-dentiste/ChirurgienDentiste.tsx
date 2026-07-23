import { usePageMetadata } from '@/hooks/usePageMetadata'

import IndépendantBase from '../indépendant/IndépendantBase'
import { configDentiste } from '../profession-libérale/simulationConfig'
import { AvertissementChirurgienDentiste } from './AvertissementChirurgienDentiste'
import { chirurgienDentisteMetadata } from './metadata'

export function ChirurgienDentiste() {
	const metadata = usePageMetadata(chirurgienDentisteMetadata)

	return (
		<IndépendantBase
			metadata={metadata}
			simulation={configDentiste}
			avertissement={<AvertissementChirurgienDentiste />}
		/>
	)
}
