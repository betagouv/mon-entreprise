import { Option } from 'effect'
import { useTranslation } from 'react-i18next'

import { useComparateur } from '@/contextes/comparateur'
import { quantitéToString } from '@/domaine/Quantite'

export const RéponseImpôt = () => {
	const { t } = useTranslation()
	const { situation } = useComparateur()
	const { méthodeImposition, tauxImposition } = situation

	if (méthodeImposition === 'barème standard') {
		return t(
			'pages.simulateurs.comparaison-statuts.réponses.impôt.barème',
			'Barème standard'
		)
	}

	const réponseTaux = t(
		'pages.simulateurs.comparaison-statuts.réponses.impôt.taux',
		'Taux personnalisé'
	)

	if (Option.isNone(tauxImposition)) {
		return réponseTaux
	}

	return `${réponseTaux}, ${quantitéToString(
		Option.getOrThrow(tauxImposition)
	)}`
}
