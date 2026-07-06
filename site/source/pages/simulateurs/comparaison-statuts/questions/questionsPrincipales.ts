import { TFunction } from 'i18next'

import { Question } from '@/domaine/SimulationConfig'

export const questionActivitéPrincipale = {
	libellé: (t: TFunction) =>
		t(
			'pages.simulateurs.comparaison-statuts.questions.activité.principale',
			'Activité principale'
		),
	dottedName: 'entreprise . activité . nature',
} satisfies Question

export const questionTypeActivité = {
	libellé: (t: TFunction) =>
		t(
			'pages.simulateurs.comparaison-statuts.questions.activité.type',
			'Type d’activité'
		),
	dottedName: 'entreprise . activités . service ou vente',
} satisfies Question

export const questionActivitéRéglementée = {
	libellé: (t: TFunction) =>
		t(
			'pages.simulateurs.comparaison-statuts.questions.activité.réglementée',
			'Activité réglementée'
		),
	dottedName: 'entreprise . activité . nature . libérale . réglementée',
} satisfies Question

export const questionAcre = {
	libellé: (t: TFunction) =>
		t('pages.simulateurs.comparaison-statuts.questions.acre', 'Acre'),
	dottedName: 'dirigeant . exonérations . ACRE',
} satisfies Question
