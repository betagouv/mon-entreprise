import { useTranslation } from 'react-i18next'

import { useComparateur } from '@/contextes/comparateur'

export const RéponseFoyerFiscal = () => {
	const { t } = useTranslation()
	const { situation } = useComparateur()
	const { situationFamiliale, enfants, parentIsolé } = situation

	const réponseSituationFamiliale =
		situationFamiliale === 'célibataire'
			? t(
					'pages.simulateurs.comparaison-statuts.réponses.foyer-fiscal.célibataire',
					'Célibataire'
				)
			: situationFamiliale === 'couple'
				? t(
						'pages.simulateurs.comparaison-statuts.réponses.foyer-fiscal.couple',
						'Marié/Mariée ou pacsé/pacsée'
					)
				: t(
						'pages.simulateurs.comparaison-statuts.réponses.foyer-fiscal.veuf',
						'Veuf/Veuve'
					)

	if (enfants.valeur === 0) {
		return réponseSituationFamiliale
	}

	const réponseEnfants = `, ${t(
		'pages.simulateurs.comparaison-statuts.réponses.foyer-fiscal.enfant',
		{
			defaultValue: '{{ count }} enfant',
			defaultValue_many: '{{ count }} enfants',
			defaultValue_other: '{{ count }} enfants',
			count: enfants.valeur,
		}
	)}`

	if (situationFamiliale !== 'célibataire') {
		return réponseSituationFamiliale + réponseEnfants
	}

	if (!parentIsolé) {
		return réponseSituationFamiliale + réponseEnfants
	}

	return `${réponseSituationFamiliale + réponseEnfants} (${t(
		'pages.simulateurs.comparaison-statuts.réponses.foyer-fiscal.parent-isolé',
		'parent isolé'
	)})`
}
