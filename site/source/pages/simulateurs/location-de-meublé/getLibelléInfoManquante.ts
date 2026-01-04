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
				'type de durée'
			)
		case 'autresRevenus':
			return t(
				'pages.simulateurs.location-de-logement-meublé.conditions.autresRevenus',
				'montant des autres revenus'
			)
		case 'classement':
			return t(
				'pages.simulateurs.location-de-logement-meublé.conditions.classement',
				'classement du logement'
			)
		case 'recettesCourteDurée':
			return t(
				'pages.simulateurs.location-de-logement-meublé.conditions.recettesCourteDurée',
				'recettes de courte durée'
			)
	}
}
