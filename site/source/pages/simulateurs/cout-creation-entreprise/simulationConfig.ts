import { PublicodesSimulationConfig } from '@/domaine/PublicodesSimulationConfig'

export const configCoûtCréationEntreprise: PublicodesSimulationConfig = {
	nomModèle: 'modele-social',
	'objectifs exclusifs': [],
	objectifs: ['entreprise . coût formalités . création'],
	questions: {
		'liste noire': ['entreprise . activité . nature'],
		'non prioritaires': ['établissement . commune'],
	},
	situation: {
		'entreprise . catégorie juridique . association': {
			'applicable si': 'non',
		},
	},
}
