import { SimulationConfig } from './types'

export const configSASU: SimulationConfig = {
	objectifs: [
		'dirigeant . rémunération . totale',
		'salarié . rémunération . net . à payer avant impôt',
		'salarié . rémunération . net . payé après impôt',
	],
	'objectifs cachés': ['impôt . montant', 'salarié . cotisations'],
	questions: {
		"à l'affiche": [
			{
				label: 'ACRE',
				dottedName: 'dirigeant . exonérations . ACRE',
			},
			{
				label: 'Commune',
				dottedName: 'établissement . commune',
			},
			{
				label: 'Avantages en nature',
				dottedName: 'salarié . rémunération . avantages en nature',
			},
			{
				label: 'Impôt sur le revenu',
				dottedName: 'impôt . méthode de calcul',
			},
		],
		'liste noire': [
			'entreprise . charges',
			'entreprise . imposition',
			// 'entreprise . rémunération du dirigeant', n'existe plus
			'entreprise . association non lucrative',
		],
		'non prioritaires': [
			'entreprise . TVA',
			'établissement . commune',
			"situation personnelle . domiciliation fiscale à l'étranger",
			'salarié . régimes spécifiques . impatriés',
		],
	},
	'unité par défaut': '€/an',
	situation: {
		'entreprise . catégorie juridique': "'SAS'",
		'entreprise . résultat fiscal': '0 €/an',

		// TODO : en attendant que la transitivité du remplacement soit implémentée (https://github.com/betagouv/publicodes/issues/55)
		'salarié . activité partielle': 'non',
		'salarié . régimes spécifiques . DFS': 'non',
	},
}
