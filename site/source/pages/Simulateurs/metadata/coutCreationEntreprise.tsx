import { AbsoluteSitePaths } from '@/sitePaths'

import { CoutCreationEntreprise } from '../CoutCreationEntreprise'
import { SimulationConfig } from '../configs/types'
import { MetadataSrc } from '../metadata-src'

const config: SimulationConfig = {
	'objectifs exclusifs': [],
	objectifs: ['entreprise . coût formalités . création'],
	questions: {
		'liste noire': ['entreprise . activité . nature'],
	},
	// 'unité par défaut': '€/mois',
	situation: {},
}

export const coutCreationEntreprise = (
	pureSimulatorsData: MetadataSrc,
	sitePaths: AbsoluteSitePaths
) => ({
	...pureSimulatorsData['coût-création-entreprise'],
	config,
	meta: {
		...pureSimulatorsData['coût-création-entreprise']?.meta,
	},
	path: sitePaths.simulateurs['coût-création-entreprise'],
	component: CoutCreationEntreprise,
	seoExplanations: <></>,
})
