import { Predicate } from 'effect/Predicate'
import { fromEntries } from 'effect/Record'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { DottedName } from '@/domaine/publicodes/DottedName'
import { NomModèle } from '@/domaine/SimulationConfig'
import { Situation } from '@/domaine/Situation'
import { estCeQueLaQuestionPublicodesEstRépondue } from '@/domaine/useQuestions/estCeQueLaQuestionPublicodesEstRépondue'
import { QuestionRépondue } from '@/store/reducers/simulation.reducer'
import { listeNoireSelector } from '@/store/selectors/simulation/config/listeNoire.selector'
import { raccourcisSelector } from '@/store/selectors/simulation/config/raccourcis.selector'
import { questionsRéponduesSelector } from '@/store/selectors/simulation/questions/questionsRépondues.selector'
import { questionsSuivantesSelector } from '@/store/selectors/simulation/questions/questionsSuivantes.selector'

import { useEngineFromModèle } from './useEngineFromModèle'

export interface QuestionPublicodes<S extends Situation> {
	_tag: 'QuestionPublicodes'
	id: DottedName
	applicable: Predicate<S | undefined>
	répondue: Predicate<S | undefined>
}

const fromQuestionPublicodeRépondue = <S extends Situation>(
	q: QuestionRépondue,
	estRépondue: (dottedName: DottedName) => boolean
): QuestionPublicodes<S> => ({
	_tag: 'QuestionPublicodes',
	id: q.règle,
	applicable: () => q.applicable,
	répondue: () => estRépondue(q.règle),
})

const fromQuestionsPublicodesSuivante = <S extends Situation>(
	dottedName: DottedName,
	estRépondue: (dottedName: DottedName) => boolean
): QuestionPublicodes<S> => ({
	_tag: 'QuestionPublicodes',
	id: dottedName,
	applicable: () => true,
	répondue: () => estRépondue(dottedName),
})

export function useQuestionsPublicodes(nomModèle: NomModèle) {
	const engine = useEngineFromModèle(nomModèle)
	const dottedNamesQuestionsSuivantes = useSelector(questionsSuivantesSelector)
	const questionsRépondues = useSelector(questionsRéponduesSelector)
	const dottedNamesListeNoire = useSelector(listeNoireSelector)
	const raccourcis = useSelector(raccourcisSelector)

	const questionsRéponduesFiltrées = useMemo(
		() =>
			questionsRépondues.filter(
				(q) => !dottedNamesListeNoire.includes(q.règle)
			),
		[questionsRépondues, dottedNamesListeNoire]
	)

	const estQuestionPublicodesRépondue = useMemo(
		() =>
			estCeQueLaQuestionPublicodesEstRépondue(
				engine,
				questionsRéponduesFiltrées
			),
		[engine, questionsRéponduesFiltrées]
	)

	const questions = useMemo(() => {
		const questionsRépondues = questionsRéponduesFiltrées.map((q) =>
			fromQuestionPublicodeRépondue(q, estQuestionPublicodesRépondue)
		)

		const questionsSuivantes = dottedNamesQuestionsSuivantes.map((dottedName) =>
			fromQuestionsPublicodesSuivante(dottedName, estQuestionPublicodesRépondue)
		)

		const toutesLesQuestions = [...questionsRépondues, ...questionsSuivantes]
		const questionsParId = fromEntries(toutesLesQuestions.map((q) => [q.id, q]))

		return Object.values(questionsParId)
	}, [
		questionsRéponduesFiltrées,
		dottedNamesQuestionsSuivantes,
		estQuestionPublicodesRépondue,
	])

	return {
		questions,
		raccourcis,
	}
}
