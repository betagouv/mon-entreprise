import { PublicodesSimulationConfig } from '@/domaine/PublicodesSimulationConfig'

export const configSASU: PublicodesSimulationConfig = {
	nomModèle: 'modele-as',
	'objectifs exclusifs': [
		'assimilé salarié . rémunération . totale',
		'assimilé salarié . rémunération . brute',
		'assimilé salarié . rémunération . nette . avec dividendes',
		'assimilé salarié . rémunération . nette . après impôt . avec dividendes',
	],
	objectifs: [
		'assimilé salarié . dividendes',
		'assimilé salarié . rémunération . impôt',
		'assimilé salarié . rémunération . impôt . avec dividendes',
		'assimilé salarié . cotisations . avec dividendes',
	],
	questions: {
		raccourcis: [
			{
				label: 'Acre',
				dottedName: 'assimilé salarié . exonérations . Acre',
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
	situation: {
		'entreprise . imposition': "'IS'",
	},
}
