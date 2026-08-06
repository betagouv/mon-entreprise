import { useTranslation } from 'react-i18next'

import { useComparateur } from '@/contextes/comparateur'

export const RéponseActivité = () => {
	const { t } = useTranslation()
	const { situation } = useComparateur()
	const { natureActivité, typeActivité, activitéLibéraleRéglementée } =
		situation

	if (natureActivité === 'libérale') {
		return activitéLibéraleRéglementée
			? t(
					'pages.simulateurs.comparaison-statuts.réponses.activité.libérale-réglementée',
					'Libérale réglementée'
				)
			: t(
					'pages.simulateurs.comparaison-statuts.réponses.activité.libérale-non-réglementée',
					'Libérale non réglementée'
				)
	}

	const réponseActivité =
		natureActivité === 'artisanale'
			? t(
					'pages.simulateurs.comparaison-statuts.réponses.activité.artisanale',
					'Artisanale'
				)
			: t(
					'pages.simulateurs.comparaison-statuts.réponses.activité.commerciale',
					'Commerciale'
				)

	return `${réponseActivité} (${
		typeActivité === 'vente'
			? t(
					'pages.simulateurs.comparaison-statuts.réponses.activité.vente',
					'vente'
				)
			: t(
					'pages.simulateurs.comparaison-statuts.réponses.activité.service',
					'prestation de service'
				)
	})`
}
