import { SimulationConfig } from '@/domaine/SimulationConfig'

export const configSASU: SimulationConfig = {
	nomModèle: 'modele-as',
	'objectifs exclusifs': [
		'assimilé salarié . rémunération . totale',
		'assimilé salarié . rémunération . brute',
		'assimilé salarié . rémunération . nette . à payer avant impôt',
		'assimilé salarié . rémunération . nette . après impôt',
	],
	objectifs: [
		'assimilé salarié . rémunération . impôt',
		'assimilé salarié . cotisations',
	],
	questions: {
		raccourcis: [
			{
				label: 'ACRE',
				dottedName: 'assimilé salarié . exonérations . ACRE',
			},
			{
				label: 'Commune',
				dottedName: 'établissement . commune',
			},
			{
				label: 'Avantages en nature',
				dottedName: 'assimilé salarié . rémunération . avantages en nature',
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
