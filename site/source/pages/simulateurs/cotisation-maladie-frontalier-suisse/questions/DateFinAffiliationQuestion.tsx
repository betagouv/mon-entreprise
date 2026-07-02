import * as O from 'effect/Option'
import { useCallback } from 'react'

import { ComposantQuestionFournie } from '@/components/Simulateur/ComposantQuestionFournie'
import {
	SituationFrontalierSuisse,
	useFrontalierSuisse,
} from '@/contextes/frontalier-suisse'
import { DateField, ValeurDate } from '@/design-system'

export const DateFinAffiliationQuestion: ComposantQuestionFournie<
	SituationFrontalierSuisse
> = () => {
	const { situation, set } = useFrontalierSuisse()

	const handleChange = useCallback(
		(date: Date | undefined) => set.dateFinAffiliation(O.fromNullable(date)),
		[set]
	)

	return (
		<DateField
			defaultSelected={O.getOrUndefined(situation.dateFinAffiliation)}
			onChange={handleChange}
		/>
	)
}

DateFinAffiliationQuestion._tag = 'QuestionFournie'
DateFinAffiliationQuestion.id = 'date-fin-affiliation'
DateFinAffiliationQuestion.libellé = (t) =>
	t(
		'pages.simulateurs.cotisation-maladie-frontalier-suisse.questions.date-fin-affiliation.libellé',
		'À quelle date votre affiliation prend-elle fin ?'
	)
const ValeurDateFinAffiliation = () => {
	const { situation } = useFrontalierSuisse()

	return <ValeurDate date={O.getOrUndefined(situation.dateFinAffiliation)} />
}

DateFinAffiliationQuestion.applicable = () => true
DateFinAffiliationQuestion.Valeur = ValeurDateFinAffiliation
