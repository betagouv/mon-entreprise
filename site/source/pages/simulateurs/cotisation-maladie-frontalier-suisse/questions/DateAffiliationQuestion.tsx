import * as O from 'effect/Option'
import { useCallback } from 'react'

import { ComposantQuestionFournie } from '@/components/Simulateur/ComposantQuestionFournie'
import {
	SituationFrontalierSuisse,
	useFrontalierSuisse,
} from '@/contextes/frontalier-suisse'
import { DateField } from '@/design-system'

export const DateAffiliationQuestion: ComposantQuestionFournie<
	SituationFrontalierSuisse
> = () => {
	const { situation, set } = useFrontalierSuisse()

	const handleChange = useCallback(
		(date: Date | undefined) => set.dateAffiliation(O.fromNullable(date)),
		[set]
	)

	return (
		<DateField
			defaultSelected={O.getOrUndefined(situation.dateAffiliation)}
			onChange={handleChange}
		/>
	)
}

DateAffiliationQuestion._tag = 'QuestionFournie'
DateAffiliationQuestion.id = 'date-affiliation'
DateAffiliationQuestion.libellé = (t) =>
	t(
		'pages.simulateurs.cotisation-maladie-frontalier-suisse.questions.date-affiliation.libellé',
		'À quelle date votre affiliation a-t-elle débuté ?'
	)
DateAffiliationQuestion.applicable = () => true
