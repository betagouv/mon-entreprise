import { SimulationConfig } from '@/domaine/SimulationConfig'

export const configSASU: SimulationConfig = {
	modeleId: 'modele-as',
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
		'liste noire': [
			// 'entreprise . charges',
			// 'entreprise . imposition',
			// 'entreprise . association non lucrative',
		],
		'non prioritaires': [
			'entreprise . TVA',
			'établissement . commune',
			"situation personnelle . domiciliation fiscale à l'étranger",
			// 'salarié . régimes spécifiques . impatriés',
		],
	},
	'unité par défaut': '€/an',
	situation: {
		// 'entreprise . catégorie juridique': "'SAS'",
		// 'entreprise . résultat fiscal': '0 €/an',
		// TODO : en attendant que la transitivité du remplacement soit implémentée (https://github.com/publicodes/publicodes/issues/55)
		// 'salarié . activité partielle': 'non',
		// 'salarié . régimes spécifiques . DFS': 'non',
	},
}
