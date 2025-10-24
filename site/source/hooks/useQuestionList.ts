import { RuleNode } from 'publicodes'
import { useDispatch, useSelector } from 'react-redux'

import { ValeurPublicodes } from '@/domaine/engine/PublicodesAdapter'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { useEngine } from '@/hooks/useEngine'
import { useNextQuestions } from '@/hooks/useNextQuestion'
import { enregistreLaRéponseÀLaQuestion } from '@/store/actions/actions'
import { questionsRéponduesNomSelector } from '@/store/selectors/questionsRéponduesNom.selector'

export function useQuestionList(): [
	questions: Array<RuleNode & { dottedName: DottedName }>,
	onQuestionAnswered: (
		dottedName: DottedName
	) => (value?: ValeurPublicodes) => void,
] {
	const answeredQuestions = useSelector(questionsRéponduesNomSelector)
	const nextQuestions = useNextQuestions()
	const engine = useEngine()

	const questions = [...answeredQuestions, ...nextQuestions]
		.filter((dottedName) => engine.evaluate(dottedName).nodeValue !== null)
		.map((dottedName) => engine.getRule(dottedName))

	const dispatch = useDispatch()

	const onQuestionAnswered =
		(dottedName: DottedName) => (value?: ValeurPublicodes) => {
			dispatch(enregistreLaRéponseÀLaQuestion(dottedName, value))
		}

	return [questions, onQuestionAnswered]
}
