import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { ValeurPublicodes } from '@/domaine/engine/PublicodesAdapter'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { Situation } from '@/domaine/Situation'
import { QuestionPublicodes as TypeQuestionPublicodes } from '@/hooks/useQuestions'
import { enregistreLaRéponseÀLaQuestion } from '@/store/actions/actions'
import { useEngine } from '@/utils/publicodes/EngineContext'
import { evaluateQuestion } from '@/utils/publicodes/publicodes'

import { RuleField } from '../conversation/RuleField'

type Props<S extends Situation> = {
	question: TypeQuestionPublicodes<S>
	handleGoToNext: () => void
}

export const QuestionPublicodes = <S extends Situation>({
	question,
	handleGoToNext,
}: Props<S>) => {
	const dispatch = useDispatch()
	const engine = useEngine()

	const dottedName = question.id
	const rule = engine.getRule(dottedName)

	const handleQuestionResponse = useCallback(
		(dottedName: DottedName, value: ValeurPublicodes | undefined) => {
			dispatch(enregistreLaRéponseÀLaQuestion(dottedName, value))
		},
		[dispatch]
	)

	const questionCouranteLabel = evaluateQuestion(engine, rule)

	return (
		<RuleField
			dottedName={dottedName}
			labelOrLegend={questionCouranteLabel}
			onChange={(value, name) => handleQuestionResponse(name, value)}
			onSubmit={handleGoToNext}
		/>
	)
}
