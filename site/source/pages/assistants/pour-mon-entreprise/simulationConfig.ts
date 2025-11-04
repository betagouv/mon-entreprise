import { SimulationConfig } from '@/domaine/SimulationConfig'

export const configPourMonEntreprise: SimulationConfig = {
	nomModèle: 'modele-social',
	questions: {
		'liste noire': ['entreprise . imposition . régime'],
	},
	objectifs: ['dirigeant . régime social', 'entreprise . imposition'],
	situation: {
		'entreprise . catégorie juridique . EI . auto-entrepreneur . par défaut':
			'oui',
	},
}
