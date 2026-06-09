import { pipe } from 'effect'
import * as A from 'effect/Array'
import { isUndefined, Predicate } from 'effect/Predicate'
import * as R from 'effect/Record'
import { TFunction } from 'i18next'
import { FunctionComponent, useMemo, useState } from 'react'

import {
	ComposantQuestion,
	GroupeDeQuestionsFournies,
} from '@/components/Simulation/ComposantQuestion'
import { Situation } from '@/domaine/Situation'

import {
	GroupeDeQuestionsPublicodes,
	QuestionPublicodes,
} from './useQuestionsPublicodesEditorialisees'

type QuestionFournie<S extends Situation> = Omit<
	ComposantQuestion<S>,
	'répondue' | 'applicable'
> & {
	répondue: Predicate<S | undefined>
	applicable: Predicate<S | undefined>
} & FunctionComponent

const adapteUneQuestionFournie = <S extends Situation>(
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

const adapteLesQuestionsFourniesDansLeGroupe = <S extends Situation>(
	groupeDeQuestionsFournies: GroupeDeQuestionsFournies<S>
): GroupeDeQuestions<S> => ({
	...groupeDeQuestionsFournies,
	liste: groupeDeQuestionsFournies.liste.map(adapteUneQuestionFournie),
})

const estApplicableDansLaSituation =
	<S extends Situation>(situation: S | undefined) =>
	(question: Question<S>) =>
		question.applicable(situation)

const filtreLesQuestionsApplicablesDansLeGroupe =
	<S extends Situation>(situation: S | undefined) =>
	(groupeDeQuestion: GroupeDeQuestions<S>) => ({
		...groupeDeQuestion,
		liste: groupeDeQuestion.liste.filter(
			estApplicableDansLaSituation(situation)
		),
	})

const filtreLesGroupesSansQuestions = <S extends Situation>(
	groupeDeQuestion: GroupeDeQuestions<S>
) => groupeDeQuestion.liste.length > 0

export type Question<S extends Situation> =
	| QuestionFournie<S>
	| QuestionPublicodes

export type GroupeDeQuestions<S extends Situation> = {
	titre: (t: TFunction) => string
	liste: Array<Question<S>>
}

export interface UseQuestionsProps<S extends Situation = Situation> {
	questionsFourniesPrincipales?: ComposantQuestion<S>[]
	questionsPublicodesPrincipales?: QuestionPublicodes[]
	groupesDeQuestionsFournies?: Record<string, GroupeDeQuestionsFournies<S>>
	groupesDeQuestionsPublicodes?: Record<string, GroupeDeQuestionsPublicodes>
	situation?: S
}

export function useQuestionsÉditorialisées<S extends Situation = Situation>({
	questionsFourniesPrincipales = [],
	questionsPublicodesPrincipales = [],
	groupesDeQuestionsFournies = {},
	groupesDeQuestionsPublicodes = {},
	situation,
}: UseQuestionsProps<S>) {
	const questionsPrincipales = useMemo(
		() =>
			pipe(
				questionsFourniesPrincipales,
				A.map(adapteUneQuestionFournie),
				A.union(questionsPublicodesPrincipales),
				A.filter(estApplicableDansLaSituation(situation))
			),
		[questionsFourniesPrincipales, questionsPublicodesPrincipales, situation]
	)

	const groupesDeQuestions = useMemo(
		() =>
			pipe(
				groupesDeQuestionsFournies,
				R.map(adapteLesQuestionsFourniesDansLeGroupe),
				R.union(groupesDeQuestionsPublicodes, (_, qPublicodes) => qPublicodes),
				R.map(filtreLesQuestionsApplicablesDansLeGroupe(situation)),
				R.filter(filtreLesGroupesSansQuestions)
			),
		[groupesDeQuestionsFournies, groupesDeQuestionsPublicodes, situation]
	)

	const [questionCouranteId, setQuestionCouranteId] = useState<
		string | undefined
	>()
	const questionCourante = isUndefined(questionCouranteId)
		? undefined
		: groupesDeQuestions[questionCouranteId]

	return {
		questionsPrincipales,
		groupesDeQuestions,
		questionCourante,
		setQuestionCouranteId,
	}
}
