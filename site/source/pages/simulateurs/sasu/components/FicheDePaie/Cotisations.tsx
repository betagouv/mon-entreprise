import { RègleModèleAssimiléSalarié } from 'modele-as'

import { SectionCotisations } from '@/components/simulationExplanation/FicheDePaie/SectionCotisations'

const ORDRE_DES_SECTIONS = [
	'assimilé salarie . cotisations . catégories . maladie',
	'assimilé salarie . cotisations . catégories . atmp',
	'assimilé salarie . cotisations . catégories . retraite',
	'assimilé salarie . cotisations . catégories . divers',
	'assimilé salarie . cotisations . catégories . CSG-CRDS',
	'assimilé salarie . cotisations . catégories . exonérations',
	'assimilé salarie . cotisations . catégories . facultatives',
] as Array<RègleModèleAssimiléSalarié>

export const Cotisations = () => (
	<SectionCotisations
		namespace="assimilé salarie"
		ordreDesSections={ORDRE_DES_SECTIONS}
	/>
)
