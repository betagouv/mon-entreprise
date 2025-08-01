import { Contexte } from '@/domaine/Contexte'
import { Montant, montantToNumber } from '@/domaine/Montant'

export const AutoEntrepreneurContexteDansPublicodes: Contexte = {
	'entreprise . catégorie juridique': "'EI'",
	'entreprise . catégorie juridique . EI . auto-entrepreneur': 'oui',
	'dirigeant . auto-entrepreneur': 'oui',
}

export const AutoEntrepreneurCotisationsEtContributionsDansPublicodes = {
	enEurosParAn: {
		valeur: 'dirigeant . auto-entrepreneur . cotisations et contributions',
		unité: '€/an',
	},
	enEurosParMois: {
		valeur: 'dirigeant . auto-entrepreneur . cotisations et contributions',
		unité: '€/mois',
	},
}

export const AutoEntrepreneurChiffreAffaireDansPublicodes = {
	fromMontant: (montant: Montant<'€/an'>) => ({
		"dirigeant . auto-entrepreneur . chiffre d'affaires": `${montantToNumber(
			montant
		)} €/an`,
	}),
}
