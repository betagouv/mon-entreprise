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

export const DateAffiliationQuestion: ComposantQuestionFournie<
	SituationFrontalierSuisse
> = () => {
	const { situation, set } = useFrontalierSuisse()
	const { t } = useTranslation()

	const handleChange = useCallback(
		(date: Date | undefined) => set.dateAffiliation(O.fromNullable(date)),
		[set]
	)

	return (
		<DateField
			defaultSelected={O.getOrUndefined(situation.dateAffiliation)}
			onChange={handleChange}
			validation={(date) =>
				datesAffiliationCohérentes({
					...situation,
					dateAffiliation: O.some(date),
				})
					? O.none()
					: O.some(
							t(
								'pages.simulateurs.cotisation-maladie-frontalier-suisse.questions.date-affiliation.erreur',
								'La date de début d’affiliation ne peut pas être postérieure à la date de fin.'
							)
					  )
			}
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
const ValeurDateAffiliation = () => {
	const { situation } = useFrontalierSuisse()

	return <ValeurDate date={O.getOrUndefined(situation.dateAffiliation)} />
}

DateAffiliationQuestion.applicable = () => true
DateAffiliationQuestion.Valeur = ValeurDateAffiliation
