import { useTranslation } from 'react-i18next'

import { usePageMetadata } from '@/hooks/usePageMetadata'

import IndépendantBase from '../indépendant/IndépendantBase'
import { AvertissementEIRL } from './Avertissement'
import { eirlMetadata } from './metadata'
import { eirlOpenGraph } from './opengraph'
import { configEirl } from './simulationConfig'

export function EIRL() {
	const { t } = useTranslation()
	const metadata = usePageMetadata(eirlMetadata)

	return (
		<IndépendantBase
			metadata={metadata}
			simulation={configEirl}
			avertissement={<AvertissementEIRL />}
			openGraph={eirlOpenGraph(t)}
			conseillersEntreprisesVariant="revenus_par_statut"
		/>
	)
}
