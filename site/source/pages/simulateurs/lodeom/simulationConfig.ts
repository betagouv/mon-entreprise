import { SimulationConfig } from '@/domaine/SimulationConfig'

export const configLodeom: SimulationConfig = {
	nomModèle: 'modele-social',
	objectifs: ['salarie . cotisations . exonérations . lodeom . montant'],
	questions: {
		raccourcis: [
			{
				label: 'Temps partiel',
				dottedName: 'salarie . contrat . temps de travail . temps partiel',
			},
			{
				label: 'Heures supplémentaires',
				dottedName: 'salarie . temps de travail . heures supplémentaires',
			},
			{
				label: 'Heures complémentaires',
				dottedName: 'salarie . temps de travail . heures complémentaires',
			},
			{
				label: 'DFS',
				dottedName: 'salarie . régimes spécifiques . DFS',
			},
			{
				label: 'JEI',
				dottedName: 'salarie . cotisations . exonérations . JEI',
			},
		],
		'liste noire': [
			'établissement . commune',
			'salarie . cotisations . exonérations . zones lodeom',
			'salarie . cotisations . exonérations . lodeom . zone un . barèmes',
			"salarie . cotisations . exonérations . lodeom . secteurs d'activité éligibles",
			'salarie . cotisations . exonérations . lodeom . zone un . barème compétitivité renforcée',
			'salarie . cotisations . exonérations . lodeom . zone un . barème innovation et croissance',
			'salarie . cotisations . exonérations . lodeom . zone deux . barème renforcé',
			'entreprise . salaries . effectif . seuil',
			'salarie . contrat . CDD . motif',
			'salarie . rémunération . primes . activité . base',
			'salarie . rémunération . avantages en nature',
			"entreprise . chiffre d'affaires",
			'entreprise . charges',
		],
		'non prioritaires': ['salarie . convention collective'],
	},
	'unité par défaut': '€',
	situation: {
		dirigeant: 'non',
		'entreprise . catégorie juridique': "''",
		'entreprise . imposition': 'non',
	},
	'règles à ignorer pour déclencher les questions': [
		'entreprise . salaries . effectif',
		'salarie . cotisations . exonérations . zones lodeom',
		'salarie . cotisations . exonérations . lodeom . zone un . barèmes',
		'salarie . cotisations . exonérations . lodeom . zone deux . barèmes',
	],
}
