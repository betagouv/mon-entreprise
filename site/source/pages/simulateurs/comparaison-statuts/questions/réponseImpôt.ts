import { TFunction } from 'i18next'
import Engine from 'publicodes'

import { PublicodesAdapter } from '@/domaine/engine/PublicodesAdapter'
import { quantitéToString } from '@/domaine/Quantite'

import { isQuantitéValide, isStringValide, réponsePasDéfinie } from './utils'

export const réponseImpôt = (engine: Engine, t: TFunction) => {
	const méthode = PublicodesAdapter.decode(
		engine.evaluate('impôt . méthode de calcul')
	)

	if (!isStringValide(méthode)) {
		return réponsePasDéfinie(t)
	}

	if (méthode.value === 'barème standard') {
		return t(
			'pages.simulateurs.comparaison-statuts.réponses.impôt.barème',
			'Barème standard'
		)
	}

	const taux = PublicodesAdapter.decode(
		engine.evaluate('impôt . taux personnalisé')
	)

	const réponseTaux = t(
		'pages.simulateurs.comparaison-statuts.réponses.impôt.taux',
		'Taux personnalisé'
	)

	if (!isQuantitéValide(taux)) {
		return réponseTaux
	}

	return `${réponseTaux}, ${quantitéToString(taux.value)}`
}
