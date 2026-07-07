import { Montant, montantToNumber } from '@/domaine/Montant'

export const TravailleurIndependantContexteDansPublicodes = {
	'dirigeant . régime social': "'independant'",
	'entreprise . imposition': "'IR'",
	'entreprise . catégorie juridique': "''",
	salarie: 'non',
}

export const TravailleurIndependantChiffreAffaireDansPublicodes = {
	fromMontant: (montant: Montant<'€/an'>) => ({
		"entreprise . chiffre d'affaires": `${montantToNumber(montant)} €/an`,
	}),
}

export const TravailleurIndependantCotisationsEtContributionsDansPublicodes = {
	enEurosParAn: 'dirigeant . independant . cotisations et contributions',
}
