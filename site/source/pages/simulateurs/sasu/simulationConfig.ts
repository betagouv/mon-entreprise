import { SimulationConfig } from '@/domaine/SimulationConfig'

export const configSASU: SimulationConfig = {
	nomModèle: 'modele-as',
	'objectifs exclusifs': [
		'assimilé salarie . rémunération . totale',
		'assimilé salarie . rémunération . brute',
		'assimilé salarie . rémunération . nette . à payer avant impôt',
		'assimilé salarie . rémunération . nette . après impôt',
	],
	objectifs: [
		'assimilé salarie . rémunération . impôt',
		'assimilé salarie . cotisations',
	],
	questions: {
		raccourcis: [
			{
				label: 'Acre',
				dottedName: 'assimilé salarie . exonérations . Acre',
			},
			{
				label: 'Commune',
				dottedName: 'établissement . commune',
			},
			{
				label: 'Avantages en nature',
				dottedName: 'assimilé salarie . rémunération . avantages en nature',
			},
			{
				label: 'Impôt sur le revenu',
				dottedName: 'impôt . méthode de calcul',
			},
		],
		'non prioritaires': [
			'entreprise . TVA',
			'établissement . commune',
			"situation personnelle . domiciliation fiscale à l'étranger",
		],
	},
	'unité par défaut': '€/an',
	situation: {},
}
