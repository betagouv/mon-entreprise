import { SimulationConfig } from '@/domaine/SimulationConfig'

export const configAutoEntrepreneur: SimulationConfig = {
	nomModèle: 'modele-social',
	'objectifs exclusifs': [
		"dirigeant . auto-entrepreneur . chiffre d'affaires",
		'dirigeant . auto-entrepreneur . revenu net',
		'dirigeant . auto-entrepreneur . revenu net . après impôt',
	],
	objectifs: [
		'dirigeant . auto-entrepreneur . cotisations et contributions',
		'dirigeant . rémunération . impôt',
	],
	questions: {
		raccourcis: [
			{
				label: "Type d'activité",
				dottedName: 'entreprise . activité . nature',
			},
			{
				label: 'Versement libératoire',
				dottedName:
					'dirigeant . auto-entrepreneur . impôt . versement libératoire',
			},
			{
				label: 'Impôt sur le revenu',
				dottedName: 'impôt . méthode de calcul',
			},
			{
				label: 'ACRE',
				dottedName: "dirigeant . auto-entrepreneur . éligible à l'ACRE",
			},
		],
		liste: [
			'entreprise',
			'dirigeant',
			'impôt',
			'établissement',
			'situation personnelle',
		],
		'non prioritaires': ['établissement . commune'],
		'liste noire': [
			'entreprise . activités . revenus mixtes',
			'entreprise . charges',
			"entreprise . chiffre d'affaires",
		],
	},
	'unité par défaut': '€/an',
	situation: {
		salarié: 'non',
		'entreprise . catégorie juridique': "'EI'",
		'entreprise . catégorie juridique . EI . auto-entrepreneur': 'oui',
		'dirigeant . auto-entrepreneur': 'oui',
	},
}
