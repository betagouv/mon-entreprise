import { SimulationConfig } from '@/domaine/SimulationConfig'

import { configIndépendant } from '../indépendant/simulationConfig'

export const configProfessionLibérale: SimulationConfig = {
	nomModèle: 'modele-ti',
	'objectifs exclusifs': [
		"entreprise . chiffre d'affaires",
		'indépendant . rémunération . nette',
		'indépendant . rémunération . nette . après impôt',
	],
	objectifs: [
		'indépendant . cotisations et contributions',
		'impôt . montant',
		'protection sociale . retraite . trimestres',
		'protection sociale . retraite . complémentaire',
		'protection sociale . retraite . base',
	],
	questions: {
		'liste noire': [
			'entreprise . charges',
			'entreprise . imposition . régime',
			'entreprise . activité . revenus mixtes',
			'entreprise . date de cessation',
		],
		liste: ['entreprise . activité', 'indépendant . PL . métier', ''],
		'non prioritaires': configIndépendant.questions?.['non prioritaires'],
	},
	'unité par défaut': '€/an',
	situation: {
		'entreprise . activité . libérale': 'oui',
		'entreprise . EI': 'oui',
		'entreprise . imposition': "'IR'",
	},
}

const configFromPLMetier = (metier: string): SimulationConfig => ({
	...configProfessionLibérale,
	situation: {
		...configProfessionLibérale.situation,
		'entreprise . activité . libérale . réglementée': 'oui',
		'indépendant . PL . métier': `'${metier}'`,
	},
})

export const configAuxiliaire = configFromPLMetier('santé . auxiliaire médical')
export const configDentiste = configFromPLMetier('santé . chirurgien-dentiste')
export const configMédecin = configFromPLMetier('santé . médecin')
export const configPharmacien = configFromPLMetier('santé . pharmacien')
export const configSageFemme = configFromPLMetier('santé . sage-femme')
export const configAvocat = configFromPLMetier('avocat')
export const configExpertComptable = configFromPLMetier('expert-comptable')
