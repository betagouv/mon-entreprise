import { DottedName } from 'modele-social'
import { PublicodesExpression, RuleNode } from 'publicodes'
import { useDispatch, useSelector } from 'react-redux'

import { stepAction, updateSituation } from '@/actions/actions'
import { useEngine } from '@/components/utils/EngineContext'
import { useNextQuestions } from '@/components/utils/useNextQuestion'
import { answeredQuestionsSelector } from '@/selectors/simulationSelectors'

export function useQuestionList(): [
	questions: Array<RuleNode & { dottedName: DottedName }>,
	onQuestionAnswered: (
		dottedName: DottedName
	) => (value?: PublicodesExpression) => void
] {
	const answeredQuestions = useSelector(answeredQuestionsSelector)
	const nextQuestions = useNextQuestions()
	const engine = useEngine()

	const questions = [...answeredQuestions, ...nextQuestions]
		.filter((dottedName) => engine.evaluate(dottedName).nodeValue !== null)
		.map((dottedName) => engine.getRule(dottedName))

	const dispatch = useDispatch()

	const onQuestionAnswered =
		(dottedName: DottedName) => (value?: PublicodesExpression) => {
			if (!answeredQuestions.includes(dottedName)) {
				dispatch(stepAction(dottedName))
			}
			dispatch(updateSituation(dottedName, value))
		}

	return [questions, onQuestionAnswered]
}
