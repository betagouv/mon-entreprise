import { PublicodesSimulationConfig } from '@/domaine/PublicodesSimulationConfig'

export const configChoixDuStatut: PublicodesSimulationConfig = {
	nomModèle: 'modele-social',
	autoloadLastSimulation: true,
	situation: {
		'entreprise . catégorie juridique . remplacements': 'non',
		'entreprise . date de création': 'date',
		salarié: 'non',
	},
}
