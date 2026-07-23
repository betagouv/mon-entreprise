import { usePageMetadata } from '@/hooks/usePageMetadata'

import IndépendantBase from './IndépendantBase'
import { indépendantMetadata } from './metadata'
import { configIndépendant } from './simulationConfig'

export function Indépendant() {
	const metadata = usePageMetadata(indépendantMetadata)

	return <IndépendantBase metadata={metadata} simulation={configIndépendant} />
}
