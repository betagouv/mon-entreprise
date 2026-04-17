import { RègleModèleAssimiléSalarié } from 'modele-as'

import { SectionCotisations } from '@/components/simulationExplanation/FicheDePaie/SectionCotisations'

const ORDRE_DES_SECTIONS = [
	'assimilé salarié . cotisations . catégories . maladie',
	'assimilé salarié . cotisations . catégories . atmp',
	'assimilé salarié . cotisations . catégories . retraite',
	'assimilé salarié . cotisations . catégories . divers',
	'assimilé salarié . cotisations . catégories . CSG-CRDS',
	'assimilé salarié . cotisations . catégories . exonérations',
	'assimilé salarié . cotisations . catégories . facultatives',
] as Array<RègleModèleAssimiléSalarié>

export const Cotisations = () => (
	<SectionCotisations
		namespace="assimilé salarié"
		ordreDesSections={ORDRE_DES_SECTIONS}
	/>
)
