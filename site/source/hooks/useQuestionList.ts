import { DottedName } from 'modele-social'
import { RuleNode } from 'publicodes'
import { useDispatch, useSelector } from 'react-redux'

import { useEngine } from '@/components/utils/EngineContext'
import { ValeurPublicodes } from '@/domaine/engine/PublicodesAdapter'
import { useNextQuestions } from '@/hooks/useNextQuestion'
import { enregistreLaRéponse } from '@/store/actions/actions'
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
			dispatch(enregistreLaRéponse(dottedName, value))
		}

	return [questions, onQuestionAnswered]
}
