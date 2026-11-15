import { RègleModèleSocial } from 'modele-social'

import { SectionCotisations } from '@/components/simulationExplanation/FicheDePaie/SectionCotisations'

export const ORDRE_DES_SECTIONS = [
	'salarié . cotisations . catégories . maladie',
	'salarié . cotisations . catégories . atmp',
	'salarié . cotisations . catégories . retraite',
	'salarié . cotisations . catégories . chômage',
	'salarié . cotisations . catégories . divers',
	'salarié . cotisations . catégories . CSG-CRDS',
	'salarié . cotisations . catégories . exonérations',
	'salarié . cotisations . catégories . facultatives',
] as Array<RègleModèleSocial>

export const Cotisations = () => (
	<SectionCotisations
		namespace="salarié"
		ordreDesSections={ORDRE_DES_SECTIONS}
	/>
)
