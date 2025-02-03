import { SimulationConfig } from '@/domaine/SimulationConfig'

export const configRéductionGénérale: SimulationConfig = {
	// TODO: remplacer 'salarié . cotisations . assiette' par 'salarié . rémunération . brut'
	// lorsque cette dernière n'incluera plus les frais professionnels.
	'objectifs exclusifs': ['salarié . cotisations . assiette'],
	objectifs: ['salarié . cotisations . exonérations . réduction générale'],
	questions: {
		"à l'affiche": [
			{
				label: 'Temps partiel',
				dottedName: 'salarié . contrat . temps de travail . temps partiel',
			},
			{
				label: 'Heures supplémentaires',
				dottedName: 'salarié . temps de travail . heures supplémentaires',
			},
			{
				label: 'Heures complémentaires',
				dottedName: 'salarié . temps de travail . heures complémentaires',
			},
			{
				label: 'DFS',
				dottedName: 'salarié . régimes spécifiques . DFS',
			},
			{
				label: 'JEI',
				dottedName: 'salarié . cotisations . exonérations . JEI',
			},
		],
		'liste noire': [
			'entreprise . salariés . effectif . seuil',
			'salarié . cotisations . exonérations . réduction générale . caisse de congés payés',
			'salarié . contrat . CDD . motif',
			'salarié . rémunération . primes . activité . base',
			'salarié . rémunération . avantages en nature',
			'établissement . commune',
		],
		'non prioritaires': ['salarié . convention collective'],
	},
	'unité par défaut': '€/an',
	situation: {
		dirigeant: 'non',
		'entreprise . catégorie juridique': "''",
		'entreprise . imposition': 'non',
	},
}
