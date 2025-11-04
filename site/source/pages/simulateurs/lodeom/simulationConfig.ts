import { SimulationConfig } from '@/domaine/SimulationConfig'

export const configLodeom: SimulationConfig = {
	nomModèle: 'modele-social',
	objectifs: ['salarié . cotisations . exonérations . lodeom . montant'],
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
			'établissement . commune',
			'salarié . cotisations . exonérations . zones lodeom',
			'salarié . cotisations . exonérations . lodeom . zone un . barèmes',
			"salarié . cotisations . exonérations . lodeom . secteurs d'activité éligibles",
			'salarié . cotisations . exonérations . lodeom . zone un . barème compétitivité renforcée',
			'salarié . cotisations . exonérations . lodeom . zone un . barème innovation et croissance',
			'salarié . cotisations . exonérations . lodeom . zone deux . barème renforcé',
			'entreprise . salariés . effectif . seuil',
			'salarié . contrat . CDD . motif',
			'salarié . rémunération . primes . activité . base',
			'salarié . rémunération . avantages en nature',
			"entreprise . chiffre d'affaires",
			'entreprise . charges',
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
		'salarié . cotisations . exonérations . zones lodeom',
		'salarié . cotisations . exonérations . lodeom . zone un . barèmes',
		'salarié . cotisations . exonérations . lodeom . zone deux . barèmes',
	],
}
