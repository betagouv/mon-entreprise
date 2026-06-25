import { Option } from 'effect'
import Engine from 'publicodes'

import {
	PublicodesAdapter,
	ValeurPublicodes,
} from '@/domaine/engine/PublicodesAdapter'
import { isOuiNon, OuiNon } from '@/domaine/OuiNon'
import { isQuantité, Quantité, quantitéToString } from '@/domaine/Quantite'
import { capitalise0 } from '@/utils'

const isStringValide = (
	option: Option.Option<ValeurPublicodes>
): option is Option.Some<string> =>
	Option.isSome(option) && typeof option.value === 'string'

const isQuantitéValide = (
	option: Option.Option<ValeurPublicodes>
): option is Option.Some<Quantité> =>
	Option.isSome(option) && isQuantité(option.value)

const isOuiNonValide = (
	option: Option.Option<ValeurPublicodes>
): option is Option.Some<OuiNon> =>
	Option.isSome(option) && isOuiNon(option.value)

export const réponseActivité = (engine: Engine) => {
	const activité = PublicodesAdapter.decode(
		engine.evaluate('entreprise . activité . nature')
	)

	if (!isStringValide(activité)) {
		return 'Pas encore défini'
	}

	if (activité.value === 'libérale') {
		const réglementée = PublicodesAdapter.decode(
			engine.evaluate('entreprise . activité . nature . libérale . réglementée')
		)

		if (!isOuiNonValide(réglementée)) {
			return 'Libérale'
		}

		return réglementée.value === 'oui'
			? 'Libérale réglementée (Cipav)'
			: 'Libérale non réglementée'
	}

	const réponseActivité = capitalise0(activité.value)

	const serviceOuVente = PublicodesAdapter.decode(
		engine.evaluate('entreprise . activités . service ou vente')
	)

	if (!isStringValide(serviceOuVente)) {
		return réponseActivité
	}

	switch (serviceOuVente.value) {
		case 'vente':
			return `${réponseActivité} (vente)`
		case 'service':
			return `${réponseActivité} (prestation de service)`
		default:
			return réponseActivité
	}
}

export const réponseImpôt = (engine: Engine) => {
	const méthode = PublicodesAdapter.decode(
		engine.evaluate('impôt . méthode de calcul')
	)

	if (!isStringValide(méthode)) {
		return 'Pas encore défini'
	}

	const réponseMéthode = capitalise0(méthode.value)

	if (méthode.value === 'barème standard') {
		return réponseMéthode
	}

	const taux = PublicodesAdapter.decode(
		engine.evaluate('impôt . taux personnalisé')
	)

	if (!isQuantitéValide(taux)) {
		return réponseMéthode
	}

	return `${réponseMéthode}, ${quantitéToString(taux.value)}`
}

export const réponseFoyerFiscal = (engine: Engine) => {
	const situationFamiliale = PublicodesAdapter.decode(
		engine.evaluate('impôt . foyer fiscal . situation de famille')
	)

	if (!isStringValide(situationFamiliale)) {
		return 'Pas encore défini'
	}

	const réponseSituationFamiliale = capitalise0(situationFamiliale.value)

	const enfants = PublicodesAdapter.decode(
		engine.evaluate('impôt . foyer fiscal . enfants à charge')
	)

	if (!isQuantitéValide(enfants)) {
		return réponseSituationFamiliale
	}

	if (enfants.value.valeur === 0) {
		return `${réponseSituationFamiliale}, sans enfant`
	}

	const réponseEnfants = `, ${quantitéToString(enfants.value)}`

	if (situationFamiliale.value !== 'célibataire') {
		return réponseSituationFamiliale + réponseEnfants
	}

	const parentIsolé = PublicodesAdapter.decode(
		engine.evaluate('impôt . foyer fiscal . parent isolé')
	)

	if (!isOuiNonValide(parentIsolé) || parentIsolé.value === 'non') {
		return réponseSituationFamiliale + réponseEnfants
	}

	return `${réponseSituationFamiliale + réponseEnfants} (parent isolé)`
}
