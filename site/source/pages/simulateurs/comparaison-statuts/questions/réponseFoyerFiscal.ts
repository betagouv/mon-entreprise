import { TFunction } from 'i18next'
import Engine from 'publicodes'

import { PublicodesAdapter } from '@/domaine/engine/PublicodesAdapter'

import {
	isOuiNonValide,
	isQuantitéValide,
	isStringValide,
	réponsePasDéfinie,
} from './utils'

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
