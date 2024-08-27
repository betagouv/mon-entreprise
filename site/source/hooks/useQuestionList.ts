import { DottedName } from 'modele-social'
import { PublicodesExpression, RuleNode } from 'publicodes'
import { useDispatch, useSelector } from 'react-redux'

import { useEngine } from '@/components/utils/EngineContext'
import { useNextQuestions } from '@/hooks/useNextQuestion'
import { enregistreLaRéponse } from '@/store/actions/actions'
import { questionsRéponduesSelector } from '@/store/selectors/questionsRépondues.selector'

export function useQuestionList(): [
	questions: Array<RuleNode & { dottedName: DottedName }>,
	onQuestionAnswered: (
		dottedName: DottedName
	) => (value?: PublicodesExpression) => void,
] {
	const answeredQuestions = useSelector(questionsRéponduesSelector)
	const nextQuestions = useNextQuestions()
	const engine = useEngine()

	const questions = [...answeredQuestions, ...nextQuestions]
		.filter((dottedName) => engine.evaluate(dottedName).nodeValue !== null)
		.map((dottedName) => engine.getRule(dottedName))

	const dispatch = useDispatch()

	const onQuestionAnswered =
		(dottedName: DottedName) => (value?: PublicodesExpression) => {
			// if (!answeredQuestions.includes(dottedName)) {
			// 	dispatch(vaÀLaQuestionSuivante())
			// }
			dispatch(enregistreLaRéponse(dottedName, value))
		}

	return [questions, onQuestionAnswered]
}
