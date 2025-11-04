import { SimulationConfig } from '@/domaine/SimulationConfig'

export const configDividendes: SimulationConfig = {
	nomModèle: 'modele-social',
	'objectifs exclusifs': [
		'bénéficiaire . dividendes . bruts',
		"bénéficiaire . dividendes . nets d'impôt",
	],
	questions: {
		// [TODO] [dividendes-indep]
		// raccourcis:
		//   Régime social du dirigeant: dirigeant
		'liste noire': ['impôt . méthode de calcul'],
	},
	'unité par défaut': '€/an',
	situation: {
		bénéficiaire: 'oui',
		'entreprise . catégorie juridique': "'SAS'",
		'entreprise . associés': "'unique'",
		'entreprise . imposition': "'IS'",
		'impôt . méthode de calcul': "'PFU'",
		'dirigeant . rémunération . net . imposable': '0 €/an',
	},
	'règles à ignorer pour déclencher les questions': [
		'impôt . méthode de calcul',
	],
}
