import { useTranslation } from 'react-i18next'

import { usePageMetadata } from '@/hooks/usePageMetadata'

import IndépendantBase from '../indépendant/IndépendantBase'
import { entrepriseIndividuelleMetadata } from './metadata'
import { entrepriseIndividuelleOpenGraph } from './opengraph'
import { SeoExplanations } from './SeoExplanations'
import { configEntrepriseIndividuelle } from './simulationConfig'

export const EntrepriseIndividuelle = () => {
	const { t } = useTranslation()
	const metadata = usePageMetadata(entrepriseIndividuelleMetadata)

	return (
		<IndépendantBase
			metadata={metadata}
			simulation={configEntrepriseIndividuelle}
			openGraph={entrepriseIndividuelleOpenGraph(t)}
			seoExplanations={<SeoExplanations />}
		/>
	)
}
