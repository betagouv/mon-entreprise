import { useTranslation } from 'react-i18next'

import { usePageMetadata } from '@/hooks/usePageMetadata'

import IndépendantBase from '../indépendant/IndépendantBase'
import { eurlMetadata } from './metadata'
import { eurlOpenGraph } from './opengraph'
import { configEurl } from './simulationConfig'

export function EURL() {
	const { t } = useTranslation()
	const metadata = usePageMetadata(eurlMetadata)

	return (
		<IndépendantBase
			metadata={metadata}
			simulation={configEurl}
			openGraph={eurlOpenGraph(t)}
		/>
	)
}
