import { SimulationConfig } from '@/domaine/SimulationConfig'

import { configIndépendant } from '../indépendant/simulationConfig'

export const configProfessionLibérale: SimulationConfig = {
	'objectifs exclusifs': [
		"entreprise . chiffre d'affaires",
		'dirigeant . rémunération . net',
		'dirigeant . rémunération . net . après impôt',
	],
	objectifs: [
		'dirigeant . indépendant . cotisations et contributions',
		'impôt . montant',
		'protection sociale . retraite . trimestres',
	],
	questions: {
		'liste noire': [
			'entreprise . charges',
			'entreprise . imposition . régime',
			'entreprise . activités',
			'entreprise . activités . revenus mixtes',
			'entreprise . date de cessation',
		],
		liste: [
			'entreprise . activité . nature',
			'dirigeant . indépendant . PL . métier',
			'',
		],
		'non prioritaires': configIndépendant.questions?.['non prioritaires'],
	},
	'unité par défaut': '€/an',
	situation: {
		salarié: 'non',
		'entreprise . activité . nature': "'libérale'",
		'entreprise . catégorie juridique': "'EI'",
		'entreprise . imposition': "'IR'",
		'entreprise . catégorie juridique . EI . auto-entrepreneur': 'non',
	},
}

const configFromPLMetier = (metier: string): SimulationConfig => ({
	...configProfessionLibérale,
	situation: {
		...configProfessionLibérale.situation,
		'entreprise . activité . nature . libérale . réglementée': 'oui',
		'dirigeant . indépendant . PL . métier': `'${metier}'`,
	},
})

export const configAuxiliaire = configFromPLMetier('santé . auxiliaire médical')
export const configDentiste = configFromPLMetier('santé . chirurgien-dentiste')
export const configMédecin = configFromPLMetier('santé . médecin')
export const configPharmacien = configFromPLMetier('santé . pharmacien')
export const configSageFemme = configFromPLMetier('santé . sage-femme')
export const configAvocat = configFromPLMetier('avocat')
export const configExpertComptable = configFromPLMetier('expert-comptable')
