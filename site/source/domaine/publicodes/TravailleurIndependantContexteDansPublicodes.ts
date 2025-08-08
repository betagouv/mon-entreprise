import { Montant, montantToNumber } from '@/domaine/Montant'

export const TravailleurIndependantContexteDansPublicodes = {
	'dirigeant . régime social': "'indépendant'",
	'entreprise . imposition': "'IR'",
	'entreprise . catégorie juridique': "''",
	salarié: 'non',
}

export const TravailleurIndependantChiffreAffaireDansPublicodes = {
	fromMontant: (montant: Montant<'€/an'>) => ({
		"entreprise . chiffre d'affaires": `${montantToNumber(montant)} €/an`,
	}),
}

export const TravailleurIndependantCotisationsEtContributionsDansPublicodes = {
	enEurosParAn: 'dirigeant . indépendant . cotisations et contributions',
}
