import { Option } from 'effect'
import { TFunction } from 'i18next'
import Engine from 'publicodes'

import {
	PublicodesAdapter,
	ValeurPublicodes,
} from '@/domaine/engine/PublicodesAdapter'
import { isOuiNon, OuiNon } from '@/domaine/OuiNon'
import { isQuantité, Quantité, quantitéToString } from '@/domaine/Quantite'

const réponsePasDéfinie = (t: TFunction) =>
	t('pages.simulateurs.commun.pas-défini', 'Pas encore défini')

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

export const réponseFoyerFiscal = (engine: Engine, t: TFunction) => {
	const situationFamiliale = PublicodesAdapter.decode(
		engine.evaluate('impôt . foyer fiscal . situation de famille')
	)

	if (!isStringValide(situationFamiliale)) {
		return réponsePasDéfinie(t)
	}

	const réponseSituationFamiliale =
		situationFamiliale.value === 'célibataire'
			? t(
					'pages.simulateurs.comparaison-statuts.réponses.foyer-fiscal.célibataire',
					'Célibataire'
			  )
			: situationFamiliale.value === 'couple'
			? t(
					'pages.simulateurs.comparaison-statuts.réponses.foyer-fiscal.couple',
					'Marié/Mariée ou pacsé/pacsée'
			  )
			: t(
					'pages.simulateurs.comparaison-statuts.réponses.foyer-fiscal.veuf',
					'Veuf/Veuve'
			  )

	const enfants = PublicodesAdapter.decode(
		engine.evaluate('impôt . foyer fiscal . enfants à charge')
	)

	if (!isQuantitéValide(enfants) || enfants.value.valeur === 0) {
		return réponseSituationFamiliale
	}

	const réponseEnfants = `, ${t(
		'pages.simulateurs.comparaison-statuts.réponses.foyer-fiscal.enfant',
		{
			defaultValue: '{{ count }} enfant',
			defaultValue_many: '{{ count }} enfants',
			defaultValue_other: '{{ count }} enfants',
			count: enfants.value.valeur,
		}
	)}`

	if (situationFamiliale.value !== 'célibataire') {
		return réponseSituationFamiliale + réponseEnfants
	}

	const parentIsolé = PublicodesAdapter.decode(
		engine.evaluate('impôt . foyer fiscal . parent isolé')
	)

	if (!isOuiNonValide(parentIsolé) || parentIsolé.value === 'non') {
		return réponseSituationFamiliale + réponseEnfants
	}

	return `${réponseSituationFamiliale + réponseEnfants} (${t(
		'pages.simulateurs.comparaison-statuts.réponses.foyer-fiscal.parent-isolé',
		'parent isolé'
	)})`
}
