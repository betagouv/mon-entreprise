import * as O from 'effect/Option'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { ComposantQuestionFournie } from '@/components/Simulateur/Questions/ComposantQuestionFournie'
import {
	datesAffiliationCohérentes,
	SituationFrontalierSuisse,
	useFrontalierSuisse,
} from '@/contextes/frontalier-suisse'
import { DateField, ValeurDate } from '@/design-system'

export const DateFinAffiliationQuestion: ComposantQuestionFournie<
	SituationFrontalierSuisse
> = () => {
	const { situation, set } = useFrontalierSuisse()
	const { t } = useTranslation()

	const handleChange = useCallback(
		(date: Date | undefined) => set.dateFinAffiliation(O.fromNullable(date)),
		[set]
	)

	return (
		<DateField
			id="date-fin-affiliation"
			defaultSelected={O.getOrUndefined(situation.dateFinAffiliation)}
			onChange={handleChange}
			validation={(date) =>
				datesAffiliationCohérentes({
					...situation,
					dateFinAffiliation: O.some(date),
				})
					? O.none()
					: O.some(
							t(
								'pages.simulateurs.cotisation-maladie-frontalier-suisse.questions.date-fin-affiliation.erreur',
								'La date de fin d’affiliation ne peut pas être antérieure à la date de début.'
							)
						)
			}
		/>
	)
}

DateFinAffiliationQuestion._tag = 'QuestionFournie'
DateFinAffiliationQuestion.id = 'date-fin-affiliation'
DateFinAffiliationQuestion.libellé = (t) =>
	t(
		'pages.simulateurs.cotisation-maladie-frontalier-suisse.questions.date-fin-affiliation.libellé',
		'Date de fin d’affiliation'
	)
DateFinAffiliationQuestion.typeRadioGroup = false
const ValeurDateFinAffiliation = () => {
	const { situation } = useFrontalierSuisse()

	return <ValeurDate date={O.getOrUndefined(situation.dateFinAffiliation)} />
}

DateFinAffiliationQuestion.applicable = () => true
DateFinAffiliationQuestion.Valeur = ValeurDateFinAffiliation
