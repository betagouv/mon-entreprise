import { TFunction } from 'i18next'
import Engine from 'publicodes'

import { PublicodesAdapter } from '@/domaine/engine/PublicodesAdapter'

import { isOuiNonValide, isStringValide, réponsePasDéfinie } from './utils'

export const réponseActivité = (engine: Engine, t: TFunction) => {
	const activité = PublicodesAdapter.decode(
		engine.evaluate('entreprise . activité . nature')
	)

	if (!isStringValide(activité)) {
		return réponsePasDéfinie(t)
	}

	if (activité.value === 'libérale') {
		const réglementée = PublicodesAdapter.decode(
			engine.evaluate('entreprise . activité . nature . libérale . réglementée')
		)

		if (!isOuiNonValide(réglementée)) {
			return t(
				'pages.simulateurs.comparaison-statuts.réponses.activité.libérale',
				'Libérale'
			)
		}

		return réglementée.value === 'oui'
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
		activité.value === 'artisanale'
			? t(
					'pages.simulateurs.comparaison-statuts.réponses.activité.artisanale',
					'Artisanale'
				)
			: t(
					'pages.simulateurs.comparaison-statuts.réponses.activité.commerciale',
					'Commerciale'
				)

	const serviceOuVente = PublicodesAdapter.decode(
		engine.evaluate('entreprise . activités . service ou vente')
	)

	if (!isStringValide(serviceOuVente)) {
		return réponseActivité
	}

	return `${réponseActivité} (${
		serviceOuVente.value === 'vente'
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
