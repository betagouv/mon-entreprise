import { pipe } from 'effect'
import { isUndefined, Predicate } from 'effect/Predicate'
import * as R from 'effect/Record'
import { TFunction } from 'i18next'
import { FunctionComponent, useMemo, useState } from 'react'

import {
	ComposantQuestion,
	QuestionsFourniesGroupées,
} from '@/components/Simulation/ComposantQuestion'
import { Situation } from '@/domaine/Situation'

import {
	QuestionPublicodes,
	QuestionsPublicodesGroupées,
} from './useQuestionsPublicodesEditorialisees'

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

export type QuestionsGroupées<S extends Situation> = {
	titre: (t: TFunction) => string
	liste: Array<Question<S>>
}

export interface UseQuestionsProps<S extends Situation = Situation> {
	questionsFourniesGroupées?: Record<string, QuestionsFourniesGroupées<S>>
	questionsPublicodesGroupées?: Record<string, QuestionsPublicodesGroupées<S>>
	situation?: S
}

export function useQuestionsÉditorialisées<S extends Situation>({
	questionsFourniesGroupées = {},
	questionsPublicodesGroupées = {},
	situation,
}: UseQuestionsProps<S>) {
	const questionsGroupées = useMemo(
		() =>
			pipe(
				questionsFourniesGroupées,
				R.map(({ titre, liste }) => ({
					titre,
					liste: liste.map(fromQuestionFournie),
				})),
				(questionsFourniesGroupées) => ({
					...questionsFourniesGroupées,
					...questionsPublicodesGroupées,
				}),
				R.map(({ titre, liste }) => ({
					titre,
					liste: liste.filter((q: Question<S>) => q.applicable(situation)),
				}))
			),
		[questionsFourniesGroupées, questionsPublicodesGroupées, situation]
	)

	const [questionCouranteId, setQuestionCouranteId] = useState<
		string | undefined
	>()
	const questionCourante = isUndefined(questionCouranteId)
		? undefined
		: questionsGroupées[questionCouranteId]

	return {
		questionsGroupées,
		questionCourante,
		setQuestionCouranteId,
	}
}
