import { SimulationConfig } from '@/domaine/SimulationConfig'

export const configRéductionGénérale: SimulationConfig = {
	objectifs: ['salarié . cotisations . exonérations . réduction générale'],
	questions: {
		raccourcis: [
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
	'unité par défaut': '€',
	situation: {
		dirigeant: 'non',
		'entreprise . catégorie juridique': "''",
		'entreprise . imposition': 'non',
	},
	'règles à ignorer pour déclencher les questions': [
		'entreprise . salariés . effectif',
		'salarié . cotisations . exonérations . réduction générale . caisse de congés payés',
	],
}
