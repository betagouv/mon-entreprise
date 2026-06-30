import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { ValeurPublicodes } from '@/domaine/engine/PublicodesAdapter'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { QuestionPublicodes as TypeQuestionPublicodes } from '@/hooks/useQuestionsPublicodesEditorialisees'
import { enregistreLaRéponseÀLaQuestion } from '@/store/actions/actions'

import { RuleField } from '../../conversation/RuleField'

type Props = {
	question: TypeQuestionPublicodes
}

export const QuestionPublicodes = ({ question }: Props) => {
	const { t } = useTranslation()
	const dispatch = useDispatch()

	const handleRéponse = useCallback(
		(dottedName: DottedName, value: ValeurPublicodes | undefined) => {
			dispatch(enregistreLaRéponseÀLaQuestion(dottedName, value))
		},
		[dispatch]
	)

	return (
		<RuleField
			dottedName={question.id}
			labelOrLegend={question.libellé(t)}
			onChange={(value, name) => handleRéponse(name, value)}
		/>
	)
}
