import { RègleModèleSocial } from 'modele-social'

import { SectionCotisations } from '@/components/simulationExplanation/FicheDePaie/SectionCotisations'

export const ORDRE_DES_SECTIONS = [
	'salarie . cotisations . catégories . maladie',
	'salarie . cotisations . catégories . atmp',
	'salarie . cotisations . catégories . retraite',
	'salarie . cotisations . catégories . chômage',
	'salarie . cotisations . catégories . divers',
	'salarie . cotisations . catégories . CSG-CRDS',
	'salarie . cotisations . catégories . exonérations',
	'salarie . cotisations . catégories . facultatives',
] as Array<RègleModèleSocial>

export const Cotisations = () => (
	<SectionCotisations
		namespace="salarie"
		ordreDesSections={ORDRE_DES_SECTIONS}
	/>
)
