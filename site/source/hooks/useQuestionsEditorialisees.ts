import { pipe } from 'effect'
import { filter } from 'effect/Array'
import { Predicate } from 'effect/Predicate'
import { FunctionComponent, useMemo, useState } from 'react'

import { ComposantQuestion } from '@/components/Simulation/ComposantQuestion'
import { Situation } from '@/domaine/Situation'

import { QuestionPublicodes } from './useQuestionsPublicodesEditorialisees'

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

export interface UseQuestionsProps<S extends Situation = Situation> {
	questionsFournies?: Array<ComposantQuestion<S>>
	questionsPublicodes?: Array<QuestionPublicodes<S>>
	situation?: S
}

export function useQuestionsÉditorialisées<S extends Situation>({
	questionsFournies = [],
	questionsPublicodes = [],
	situation,
}: UseQuestionsProps<S>) {
	const questions = useMemo(
		() =>
			pipe(
				[
					...questionsFournies.map(fromQuestionFournie),
					...questionsPublicodes,
				] as Question<S>[],
				filter((q: Question<S>): boolean => q.applicable(situation))
			),
		[questionsFournies, questionsPublicodes, situation]
	)

	const [questionCourante, setQuestionCourante] = useState<
		Question<S> | undefined
	>()

	return {
		questions,
		questionCourante,
		setQuestionCourante,
	}
}
