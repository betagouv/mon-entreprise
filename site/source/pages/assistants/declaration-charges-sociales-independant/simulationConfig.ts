import { SimulationConfig } from '@/domaine/SimulationConfig'

export const configDéclarationChargesSocialesIndépendant: SimulationConfig = {
	nomModèle: 'modele-social',
	'objectifs exclusifs': [
		'déclaration charge sociales . résultat . cotisations obligatoires',
		'déclaration charge sociales . résultat . total charges sociales déductible',
		'déclaration charge sociales . résultat . revenu net fiscal',
		'déclaration charge sociales . résultat . assiette sociale',
	],
	situation: {
		'déclaration charge sociales': 'oui',
		'dirigeant . régime social': "'indépendant'",
		date: '01/01/2024',
		'dirigeant . indépendant . PL . CIPAV': 'non',
		'entreprise . catégorie juridique': "''",
		impôt: 'non',
	},
	'unité par défaut': '€',
}
