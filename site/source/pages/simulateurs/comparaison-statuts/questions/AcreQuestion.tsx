import { useCallback } from 'react'

import { OuiNonInput } from '@/components/conversation/OuiNonInput'
import { MDXDoc } from '@/components/documentation'
import { ComposantQuestionFournie } from '@/components/Simulateur/Questions/ComposantQuestionFournie'
import { SituationComparée, useComparateur } from '@/contextes/comparateur'
import { fromOuiNon, OuiNon, toOuiNon } from '@/domaine/OuiNon'

export const AcreQuestion: ComposantQuestionFournie<SituationComparée> = () => {
	const { situation, set } = useComparateur()

	const handleChange = useCallback(
		(newValue: OuiNon | undefined) => set.acre(fromOuiNon(newValue)),
		[set]
	)

	return (
		<OuiNonInput
			id="acre"
			value={toOuiNon(situation.acre)}
			onChange={handleChange}
		/>
	)
}

const AcreValeur = () => {
	const { situation } = useComparateur()

	return toOuiNon(situation.acre)
}

AcreQuestion._tag = 'QuestionFournie'
AcreQuestion.id = 'acre'
AcreQuestion.libellé = (t) =>
	t('pages.simulateurs.comparaison-statuts.questions.acre.libellé', 'Acre')
AcreQuestion.typeRadioGroup = true
AcreQuestion.applicable = () => true
AcreQuestion.Valeur = AcreValeur
AcreQuestion.documentation = {
	Documentation: MDXDoc.documentation(
		(langue) => import(`./AcreDocumentation.${langue}.mdx`)
	),
	références: {
		'Acre : nouvelles règles et démarches à partir du 1er janvier 2026':
			'https://www.urssaf.fr/accueil/actualites/acre-nouvelles-regles-demarches.html',
		'L’Acre : une aide pour favoriser les créations et reprises d’entreprises':
			'https://www.urssaf.fr/accueil/exoneration-acre-createur.html',
		'Aide à la création ou à la reprise d’une entreprise':
			'https://www.service-public.gouv.fr/particuliers/vosdroits/F11677',
		'Acre : aide aux créateurs et repreneurs d’entreprise (ex Accre)':
			'https://bpifrance-creation.fr/encyclopedie/aides-a-creation-a-reprise-dentreprise/aides-sociales-financieres/acre-aide-aux',
	},
}
