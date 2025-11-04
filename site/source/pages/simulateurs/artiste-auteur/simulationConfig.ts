import { SimulationConfig } from '@/domaine/SimulationConfig'

export const configArtisteAuteur: SimulationConfig = {
	nomModèle: 'modele-social',
	objectifs: [
		'artiste-auteur . cotisations',
		'artiste-auteur . cotisations . IRCEC',
	],
	situation: {
		'artiste-auteur': 'oui',
		dirigeant: {
			'applicable si': 'non',
		},
	},
	'unité par défaut': '€/an',
	questions: {
		liste: [
			'artiste-auteur . revenus . BNC . micro-bnc',
			'artiste-auteur . cotisations . option surcotisation',
			'artiste-auteur . cotisations . IRCEC . cotisation RAAP . taux réduit',
			'artiste-auteur . cotisations . IRCEC . profession',
		],
	},
}
