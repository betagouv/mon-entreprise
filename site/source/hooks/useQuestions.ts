import { pipe } from 'effect'
import { dedupe, filter } from 'effect/Array'
import { isNotUndefined, isUndefined, Predicate } from 'effect/Predicate'
import { fromEntries } from 'effect/Record'
import { DottedName } from 'modele-social'
import {
	FunctionComponent,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { ComposantQuestion } from '@/components/Simulation/ComposantQuestion'
import { RaccourciPublicodes } from '@/domaine/RaccourciPublicodes'
import { Situation } from '@/domaine/Situation'
import { vaÀLaQuestionSuivante } from '@/store/actions/actions'
import { QuestionRépondue } from '@/store/reducers/simulation.reducer'
import { listeNoireSelector } from '@/store/selectors/listeNoire.selector'
import { questionsRéponduesSelector } from '@/store/selectors/questionsRépondues.selector'
import { questionsSuivantesSelector } from '@/store/selectors/questionsSuivantes.selector'
import { raccourcisSelector } from '@/store/selectors/raccourcis.selector'

interface QuestionPublicodes<S extends Situation> {
	_tag: 'QuestionPublicodes'
	id: DottedName
	applicable: Predicate<S | undefined>
	répondue: Predicate<S | undefined>
}

const fromQuestionPublicodeRépondue = <S extends Situation>(
	q: QuestionRépondue
): QuestionPublicodes<S> => ({
	_tag: 'QuestionPublicodes',
	id: q.règle,
	applicable: () => q.applicable,
	répondue: () => true,
})
const fromQuestionsPublicodesSuivante = <S extends Situation>(
	dottedName: DottedName
): QuestionPublicodes<S> => ({
	_tag: 'QuestionPublicodes',
	id: dottedName,
	applicable: () => true,
	répondue: () => false,
})

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

export interface Raccourci {
	id: string
	libellé: string
}
const fromRaccourciPublicodes = (
	quickLink: RaccourciPublicodes
): Raccourci => ({
	id: quickLink.dottedName,
	libellé: quickLink.label,
})

export interface UseQuestionsProps<S extends Situation = Situation> {
	questions?: Array<ComposantQuestion<S>>
	situation?: S
	avecQuestionsPublicodes?: boolean
}

export function useQuestions<S extends Situation>({
	questions = [],
	situation,
	avecQuestionsPublicodes = true,
}: UseQuestionsProps<S>) {
	const dispatch = useDispatch()
	const publicodesQuestionsSuivantes = useSelector(questionsSuivantesSelector)
	const publicodesQuestionsRépondues = useSelector(questionsRéponduesSelector)
	const publicodesListeNoire = useSelector(listeNoireSelector)
	const publicodesRaccourcis = useSelector(raccourcisSelector)

	const publicodesQuestionsRéponduesFiltrées = useMemo(
		() =>
			publicodesQuestionsRépondues.filter(
				(q) => !publicodesListeNoire.includes(q.règle)
			),
		[publicodesQuestionsRépondues, publicodesListeNoire]
	)

	// TODO: ajouter et gérer les raccourcis de questions fournies
	const raccourcis = useMemo(
		() => publicodesRaccourcis.map(fromRaccourciPublicodes),
		[publicodesRaccourcis]
	)

	const toutesLesQuestionsApplicables = useMemo(
		() =>
			pipe(
				[
					...questions.map(fromQuestionFournie),
					...(avecQuestionsPublicodes
						? [
								...publicodesQuestionsRéponduesFiltrées.map(
									fromQuestionPublicodeRépondue
								),
								...publicodesQuestionsSuivantes.map(
									fromQuestionsPublicodesSuivante
								),
						  ]
						: []),
				] as Question<S>[],
				filter((q: Question<S>): boolean => q.applicable(situation))
			),
		[
			questions,
			avecQuestionsPublicodes,
			publicodesQuestionsRéponduesFiltrées,
			publicodesQuestionsSuivantes,
			situation,
		]
	)

	const questionsParId = useMemo(
		() => fromEntries(toutesLesQuestionsApplicables.map((q) => [q.id, q])),
		[toutesLesQuestionsApplicables]
	)

	const idsDesQuestions = useMemo(
		() => dedupe(Object.keys(questionsParId)),
		[questionsParId]
	)

	const [activeQuestionId, setActiveQuestionId] = useState<
		Question<S>['id'] | undefined
	>(idsDesQuestions[0])
	const [finished, setFinished] = useState(false)

	useEffect(() => {
		const laQuestionActiveNEstPlusApplicable =
			activeQuestionId && !idsDesQuestions.includes(activeQuestionId)
		const pasDeQuestionActiveMaisIlYADesQuestionsApplicables =
			!activeQuestionId && idsDesQuestions.length
		if (
			laQuestionActiveNEstPlusApplicable ||
			pasDeQuestionActiveMaisIlYADesQuestionsApplicables
		) {
			setActiveQuestionId(idsDesQuestions[0])
		}
	}, [activeQuestionId, idsDesQuestions])

	const QuestionCourante = isUndefined(activeQuestionId)
		? undefined
		: questionsParId[activeQuestionId]

	const goToNext = useCallback(() => {
		if (!activeQuestionId) {
			return
		}

		const questionCourante = questionsParId[activeQuestionId]
		if (questionCourante?._tag === 'QuestionPublicodes') {
			dispatch(vaÀLaQuestionSuivante())
		}

		const currentIndex = idsDesQuestions.indexOf(activeQuestionId)
		if (currentIndex < idsDesQuestions.length - 1) {
			const nextId = idsDesQuestions[currentIndex + 1]
			setActiveQuestionId(nextId)
		} else {
			setFinished(true)
		}
	}, [activeQuestionId, idsDesQuestions, dispatch])

	const goToPrevious = useCallback(() => {
		if (finished) {
			setActiveQuestionId(idsDesQuestions[idsDesQuestions.length - 1])
			setFinished(false)

			return
		}

		if (!activeQuestionId) {
			return
		}

		const currentIndex = idsDesQuestions.indexOf(activeQuestionId)
		if (currentIndex > 0) {
			const prevId = idsDesQuestions[currentIndex - 1]
			setActiveQuestionId(prevId)
		}
	}, [activeQuestionId, finished, idsDesQuestions])

	const goTo = useCallback(
		(id: string) => {
			if (!idsDesQuestions.includes(id)) {
				return
			}

			setActiveQuestionId(id)
		},
		[idsDesQuestions]
	)

	const nombreDeQuestions = toutesLesQuestionsApplicables.length

	const nombreDeQuestionsRépondues = toutesLesQuestionsApplicables.filter((q) =>
		q.répondue(situation)
	).length

	const activeQuestionIndex = activeQuestionId
		? idsDesQuestions.indexOf(activeQuestionId)
		: -1

	const questionCouranteRépondue =
		isNotUndefined(QuestionCourante) && QuestionCourante.répondue(situation)

	return {
		nombreDeQuestions,
		nombreDeQuestionsRépondues,
		activeQuestionIndex,
		QuestionCourante,
		questionCouranteRépondue,
		raccourcis,
		finished,
		goToNext,
		goToPrevious,
		goTo,
	}
}
