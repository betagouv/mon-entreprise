import { SimulationConfig } from './types'

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
		'protection sociale . retraite . complémentaire',
		'protection sociale . retraite . CNAVPL . points acquis',
	],
	questions: {
		'liste noire': ['entreprise . charges', 'entreprise . imposition . régime'],
		liste: [
			'entreprise . activité . nature',
			'dirigeant . indépendant . PL . métier',
			'',
		],
		'non prioritaires': [
			'dirigeant . indépendant . cotisations facultatives',
			// 'dirigeant . indépendant . PL . PAMC . IJSS',
			// 'dirigeant . indépendant . IJSS',
			'dirigeant . indépendant . PL . CNAVPL . exonération incapacité',
			'dirigeant . indépendant . cotisations et contributions . exonérations . pension invalidité',
		],
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
