import { usePageMetadata } from '@/hooks/usePageMetadata'

import IndépendantBase from '../indépendant/IndépendantBase'
import { configPharmacien } from '../profession-libérale/simulationConfig'
import { AvertissementPharmacien } from './AvertissementPharmacien'
import { pharmacienMetadata } from './metadata'

export function Pharmacien() {
	const metadata = usePageMetadata(pharmacienMetadata)

	return (
		<IndépendantBase
			metadata={metadata}
			simulation={configPharmacien}
			avertissement={<AvertissementPharmacien />}
		/>
	)
}
