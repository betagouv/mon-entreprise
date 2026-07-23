import { PublicodesSimulationConfig } from '@/domaine/PublicodesSimulationConfig'

export const configPourMonEntreprise: PublicodesSimulationConfig = {
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
