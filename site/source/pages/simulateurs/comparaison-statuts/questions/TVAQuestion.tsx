import { useCallback } from 'react'

import { OuiNonInput } from '@/components/conversation/OuiNonInput'
import { MDXDoc } from '@/components/documentation'
import { ComposantQuestionFournie } from '@/components/Simulateur/Questions/ComposantQuestionFournie'
import { SituationComparée, useComparateur } from '@/contextes/comparateur'
import { fromOuiNon, OuiNon, toOuiNon } from '@/domaine/OuiNon'

export const TVAQuestion: ComposantQuestionFournie<SituationComparée> = () => {
	const { situation, set } = useComparateur()

	const handleChange = useCallback(
		(newValue: OuiNon | undefined) => set.tva(fromOuiNon(newValue)),
		[set]
	)

	return (
		<OuiNonInput
			id="tva"
			value={toOuiNon(situation.tva)}
			onChange={handleChange}
		/>
	)
}

const TVAValeur = () => {
	const { situation } = useComparateur()

	return toOuiNon(situation.tva)
}

TVAQuestion._tag = 'QuestionFournie'
TVAQuestion.id = 'tva'
TVAQuestion.libellé = (t) =>
	t(
		'pages.simulateurs.comparaison-statuts.questions.tva.libellé',
		'Entreprise assujettie à la TVA'
	)
TVAQuestion.typeRadioGroup = true
TVAQuestion.applicable = () => true
TVAQuestion.Valeur = TVAValeur
TVAQuestion.documentation = {
	Documentation: MDXDoc.documentation(
		(langue) => import(`./TVADocumentation.${langue}.mdx`)
	),
	références: {
		'Les régimes d’imposition à la TVA':
			'https://www.impots.gouv.fr/professionnel/les-regimes-dimposition-la-tva',
		'Tout savoir sur la TVA':
			'https://entreprendre.service-public.fr/vosdroits/N13445',
		'Liste des activités exonérées (Article 61 du Code général des impôts)':
			'https://www.legifrance.gouv.fr/codes/id/LEGISCTA000006179649/',
	},
}
