import { pipe } from 'effect'
import { dedupe, filter, map } from 'effect/Array'
import { isNotUndefined, isUndefined, Predicate } from 'effect/Predicate'
import { fromEntries } from 'effect/Record'
import {
	FunctionComponent,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import { useDispatch } from 'react-redux'

import { ComposantQuestion } from '@/components/Simulation/ComposantQuestion'
import { Raccourci } from '@/components/Simulation/Raccourcis'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { RaccourciPublicodes } from '@/domaine/RaccourciPublicodes'
import { Situation } from '@/domaine/Situation'
import { ignoreLaQuestion } from '@/store/actions/actions'

export interface QuestionPublicodes<S extends Situation> {
	_tag: 'QuestionPublicodes'
	id: DottedName
	applicable: Predicate<S | undefined>
	répondue: Predicate<S | undefined>
}

type QuestionFournie<S extends Situation> = Omit<
	ComposantQuestion<S>,
	'répondue' | 'applicable'
> & {
	répondue: Predicate<S | undefined>
	applicable: Predicate<S | undefined>
} & FunctionComponent

const fromQuestionFournie = <S extends Situation>(
	q: ComposantQuestion<S>
): QuestionFournie<S> => {
	const originalRépondue = q.répondue
	const originalApplicable = q.applicable

	return Object.assign(q, {
		répondue: (situation?: S) =>
			situation === undefined ? false : originalRépondue(situation),
		applicable: (situation?: S) =>
			situation === undefined ? false : originalApplicable(situation),
	})
}

export type Question<S extends Situation> =
	| QuestionFournie<S>
	| QuestionPublicodes<S>

const fromRaccourciPublicodes = (
	quickLink: RaccourciPublicodes
): Raccourci => ({
	id: quickLink.dottedName,
	libellé: quickLink.label,
})

export interface UseQuestionsProps<S extends Situation = Situation> {
	questions?: Array<ComposantQuestion<S>>
	questionsPublicodes?: Array<QuestionPublicodes<S>>
	raccourcisPublicodes?: Array<RaccourciPublicodes>
	situation?: S
}

export function useQuestions<S extends Situation>({
	questions = [],
	questionsPublicodes = [],
	raccourcisPublicodes = [],
	situation,
}: UseQuestionsProps<S>) {
	const dispatch = useDispatch()

	// TODO: ajouter et gérer les raccourcis de questions fournies
	const raccourcis = useMemo(
		() => raccourcisPublicodes.map(fromRaccourciPublicodes),
		[raccourcisPublicodes]
	)

	const toutesLesQuestionsApplicables = useMemo(
		() =>
			pipe(
				[
					...questions.map(fromQuestionFournie),
					...questionsPublicodes,
				] as Question<S>[],
				filter((q: Question<S>): boolean => q.applicable(situation))
			),
		[questions, questionsPublicodes, situation]
	)
	const toutesLesQuestionsApplicablesRef = useRef(toutesLesQuestionsApplicables)

	const questionsParId = useMemo(
		() => fromEntries(toutesLesQuestionsApplicables.map((q) => [q.id, q])),
		[toutesLesQuestionsApplicables]
	)
	const idsDesQuestions = useMemo(
		() => dedupe(Object.keys(questionsParId)),
		[questionsParId]
	)

	const questionsNonRépondues = useMemo(
		() => toutesLesQuestionsApplicables.filter((q) => !q.répondue(situation)),
		[situation, toutesLesQuestionsApplicables]
	)
	const idsDesQuestionsNonRépondues = useMemo(
		() =>
			pipe(
				questionsNonRépondues,
				map((q) => [q.id, q]),
				Object.fromEntries,
				Object.keys,
				dedupe
			),
		[questionsNonRépondues]
	)

	const [questionCouranteId, setQuestionCouranteId] = useState<
		Question<S>['id'] | undefined
	>(idsDesQuestions[0])
	const [finished, setFinished] = useState(false)

	useEffect(() => {
		const laListeDesQuestionsAChangé =
			toutesLesQuestionsApplicablesRef.current.length !==
				toutesLesQuestionsApplicables.length ||
			toutesLesQuestionsApplicables.find(
				(question, index) =>
					question.id !== toutesLesQuestionsApplicablesRef.current[index].id
			)

		if (laListeDesQuestionsAChangé) {
			const laQuestionCouranteNEstPasRépondue =
				questionCouranteId &&
				idsDesQuestionsNonRépondues.includes(questionCouranteId)
			const laQuestionCouranteNestPasLaPremièreQuestionNonRépondue =
				questionCouranteId !== idsDesQuestionsNonRépondues[0]
			const nouvellePremièreQuestionNonRépondue =
				laQuestionCouranteNEstPasRépondue &&
				laQuestionCouranteNestPasLaPremièreQuestionNonRépondue

			if (nouvellePremièreQuestionNonRépondue) {
				setQuestionCouranteId(idsDesQuestionsNonRépondues[0])
			}

			toutesLesQuestionsApplicablesRef.current = toutesLesQuestionsApplicables
		}
	}, [
		questionCouranteId,
		idsDesQuestionsNonRépondues,
		toutesLesQuestionsApplicables,
	])

	useEffect(() => {
		const laQuestionCouranteNEstPlusApplicable =
			questionCouranteId && !idsDesQuestions.includes(questionCouranteId)
		const pasDeQuestionCouranteMaisIlYADesQuestionsApplicables =
			!questionCouranteId && idsDesQuestions.length

		if (
			laQuestionCouranteNEstPlusApplicable ||
			pasDeQuestionCouranteMaisIlYADesQuestionsApplicables
		) {
			setQuestionCouranteId(idsDesQuestionsNonRépondues[0])
		}
	}, [questionCouranteId, idsDesQuestions, idsDesQuestionsNonRépondues])

	const QuestionCourante = isUndefined(questionCouranteId)
		? undefined
		: questionsParId[questionCouranteId]

	const goToNext = useCallback(() => {
		if (!questionCouranteId) {
			return
		}

		// TODO: gérer le cas "ignorer la question" pour une question fournie
		const questionCourante = questionsParId[questionCouranteId]
		const laQuestionCouranteNEstPasRépondue =
			idsDesQuestionsNonRépondues.includes(questionCouranteId)
		if (
			questionCourante?._tag === 'QuestionPublicodes' &&
			laQuestionCouranteNEstPasRépondue
		) {
			dispatch(ignoreLaQuestion(questionCouranteId as DottedName))
		}

		const currentIndex = idsDesQuestions.indexOf(questionCouranteId)
		const laQuestionCouranteNEstPasLaDernièreQuestion =
			currentIndex < idsDesQuestions.length - 1
		if (laQuestionCouranteNEstPasLaDernièreQuestion) {
			const nextId = idsDesQuestions[currentIndex + 1]
			setQuestionCouranteId(nextId)
		} else {
			setFinished(true)
		}
	}, [
		questionCouranteId,
		questionsParId,
		idsDesQuestionsNonRépondues,
		idsDesQuestions,
		dispatch,
	])

	const goToPrevious = useCallback(() => {
		if (finished) {
			setQuestionCouranteId(idsDesQuestions[idsDesQuestions.length - 1])
			setFinished(false)

			return
		}

		if (!questionCouranteId) {
			return
		}

		const currentIndex = idsDesQuestions.indexOf(questionCouranteId)
		if (currentIndex > 0) {
			const prevId = idsDesQuestions[currentIndex - 1]
			setQuestionCouranteId(prevId)
		}
	}, [questionCouranteId, finished, idsDesQuestions])

	const goTo = useCallback(
		(id: string) => {
			if (!idsDesQuestions.includes(id)) {
				return
			}

			setQuestionCouranteId(id)
		},
		[idsDesQuestions]
	)

	const nombreDeQuestions = toutesLesQuestionsApplicables.length

	const nombreDeQuestionsRépondues = toutesLesQuestionsApplicables.filter((q) =>
		q.répondue(situation)
	).length

	const questionCouranteIndex = questionCouranteId
		? idsDesQuestions.indexOf(questionCouranteId)
		: -1

	const questionCouranteRépondue =
		isNotUndefined(QuestionCourante) && QuestionCourante.répondue(situation)

	return {
		nombreDeQuestions,
		nombreDeQuestionsRépondues,
		questionCouranteIndex,
		QuestionCourante,
		questionCouranteRépondue,
		raccourcis,
		finished,
		goToNext,
		goToPrevious,
		goTo,
	}
}
