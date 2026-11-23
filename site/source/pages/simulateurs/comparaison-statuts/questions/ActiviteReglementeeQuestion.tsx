import { useCallback } from 'react'

import { OuiNonInput } from '@/components/conversation/OuiNonInput'
import { MDXDoc } from '@/components/documentation'
import { ComposantQuestionFournie } from '@/components/Simulateur/Questions/ComposantQuestionFournie'
import { SituationComparée, useComparateur } from '@/contextes/comparateur'
import { fromOuiNon, OuiNon, toOuiNon } from '@/domaine/OuiNon'

export const ActivitéRéglementéeQuestion: ComposantQuestionFournie<
	SituationComparée
> = () => {
	const { situation, set } = useComparateur()

	const handleChange = useCallback(
		(newValue: OuiNon | undefined) =>
			set.activitéLibéraleRéglementée(fromOuiNon(newValue)),
		[set]
	)

	return (
		<OuiNonInput
			id="activité-réglementée"
			value={toOuiNon(situation.activitéLibéraleRéglementée)}
			onChange={handleChange}
		/>
	)
}

const ActivitéRéglementéeValeur = () => {
	const { situation } = useComparateur()

	return toOuiNon(situation.activitéLibéraleRéglementée)
}

ActivitéRéglementéeQuestion._tag = 'QuestionFournie'
ActivitéRéglementéeQuestion.id = 'activité-réglementée'
ActivitéRéglementéeQuestion.libellé = (t) =>
	t(
		'pages.simulateurs.comparaison-statuts.questions.activité-réglementée.libellé',
		'Activité réglementée'
	)
ActivitéRéglementéeQuestion.typeRadioGroup = true
ActivitéRéglementéeQuestion.applicable = (
	situation: SituationComparée | undefined
) => situation?.natureActivité === 'libérale'
ActivitéRéglementéeQuestion.Valeur = ActivitéRéglementéeValeur
ActivitéRéglementéeQuestion.documentation = {
	Documentation: MDXDoc.documentation(
		(langue) => import(`./ActiviteReglementeeDocumentation.${langue}.mdx`)
	),
	références: {
		'Professions libérales réglementées et non réglementées':
			'https://entreprendre.service-public.gouv.fr/vosdroits/F23458',
		'Liste des professions libérales réglementées':
			'https://bpifrance-creation.fr/encyclopedie/trouver-proteger-tester-son-idee/definir-nature-son-activite/liste-professions',
	},
}
