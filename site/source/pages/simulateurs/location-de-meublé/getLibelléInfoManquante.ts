import { TFunction } from 'i18next'

import { RéponseManquante } from '@/contextes/économie-collaborative'

export const getLibelléInfoManquante = (
	t: TFunction,
	condition: RéponseManquante
): string => {
	switch (condition) {
		case 'typeDurée':
			return t(
				'pages.simulateurs.location-de-logement-meublé.conditions.typeDurée',
				'le type de durée'
			)
		case 'autresRevenus':
			return t(
				'pages.simulateurs.location-de-logement-meublé.conditions.autresRevenus',
				'le montant de vos autres revenus'
			)
		case 'classement':
			return t(
				'pages.simulateurs.location-de-logement-meublé.conditions.classement',
				'le classement du logement'
			)
		case 'recettesCourteDurée':
			return t(
				'pages.simulateurs.location-de-logement-meublé.conditions.recettesCourteDurée',
				'les recettes de courte durée'
			)
	}
}
