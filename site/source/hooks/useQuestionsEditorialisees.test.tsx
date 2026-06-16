import { renderHook } from '@testing-library/react'
import { Record } from 'effect'
import { Predicate } from 'effect/Predicate'
import { describe, expect, it } from 'vitest'

import { ComposantQuestionFournie } from '@/components/Simulateur/ComposantQuestionFournie'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { Situation } from '@/domaine/Situation'

import { useQuestionsÉditorialisées } from './useQuestionsEditorialisees'
import { QuestionPublicodes } from './useQuestionsPublicodesEditorialisees'

const questionPublicodes = (
	id: DottedName,
	applicabilité: boolean
): QuestionPublicodes => ({
	_tag: 'QuestionPublicodes',
	id,
	libellé: () => id,
	applicable: () => applicabilité,
})

const questionFournie = <S extends Situation>(
	id: string,
	applicable: Predicate<S | undefined> = () => true
): ComposantQuestionFournie<S> => {
	const Question = () => <div>Coucou</div>

	Question._tag = 'QuestionFournie'
	Question.id = id
	Question.libellé = () => id
	Question.applicable = applicable

	return Question as ComposantQuestionFournie<S>
}

describe('useQuestionsÉditorialisées', () => {
	it('supprime les questions Publicodes principales non applicables', () => {
		const questionsPublicodesPrincipales = [
			questionPublicodes('indépendant', true),
			questionPublicodes('assimilé salarié', false),
		]

		const { result } = renderHook(() =>
			useQuestionsÉditorialisées({
				questionsPublicodesPrincipales,
			})
		)

		expect(result.current.questionsPrincipales.map((q) => q.id)).toEqual([
			'indépendant',
		])
	})

	it('supprime des groupes de questions Publicodes les questions non applicables', () => {
		const groupesDeQuestionsPublicodes = {
			groupe: {
				titre: () => 'groupe',
				liste: [
					questionPublicodes('indépendant', true),
					questionPublicodes('assimilé salarié', false),
				],
			},
		}

		const { result } = renderHook(() =>
			useQuestionsÉditorialisées({
				groupesDeQuestionsPublicodes,
			})
		)

		expect(
			Record.values(result.current.groupesDeQuestions)
				.at(0)
				?.liste.map((q) => q.id)
		).toEqual(['indépendant'])
	})

	it('supprime les groupes de questions Publicodes dont aucune question n’est applicable', () => {
		const groupesDeQuestionsPublicodes = {
			groupeNonVide: {
				titre: () => 'groupe non vide',
				liste: [questionPublicodes('indépendant', true)],
			},
			groupeVide: {
				titre: () => 'groupe vide',
				liste: [questionPublicodes('assimilé salarié', false)],
			},
		}

		const { result } = renderHook(() =>
			useQuestionsÉditorialisées({
				groupesDeQuestionsPublicodes,
			})
		)

		expect(Record.keys(result.current.groupesDeQuestions)).toEqual([
			'groupeNonVide',
		])
	})
	it('supprime les questions fournies principales non applicables', () => {
		const questionsFourniesPrincipales = [
			questionFournie('question applicable'),
			questionFournie(
				'question non applicable',
				(s) => !!s && 'salarié' in s && s.salarié === 'oui'
			),
		]

		const { result } = renderHook(() =>
			useQuestionsÉditorialisées({
				questionsFourniesPrincipales,
				situation: {
					_tag: 'Situation',
					salarié: 'non',
				} as Situation,
			})
		)

		expect(result.current.questionsPrincipales.map((q) => q.id)).toEqual([
			'question applicable',
		])
	})

	it('supprime des groupes de questions fournies les questions non applicables', () => {
		const groupesDeQuestionsFournies = {
			groupe: {
				titre: () => 'groupe',
				liste: [
					questionFournie('question applicable'),
					questionFournie(
						'question non applicable',
						(s) => !!s && 'salarié' in s && s.salarié === 'oui'
					),
				],
			},
		}

		const { result } = renderHook(() =>
			useQuestionsÉditorialisées({
				groupesDeQuestionsFournies,
				situation: {
					_tag: 'Situation',
					salarié: 'non',
				} as Situation,
			})
		)

		expect(
			Record.values(result.current.groupesDeQuestions)
				.at(0)
				?.liste.map((q) => q.id)
		).toEqual(['question applicable'])
	})

	it('supprime les groupes de questions fournies dont aucune question n’est applicable', () => {
		const groupesDeQuestionsFournies = {
			groupeNonVide: {
				titre: () => 'groupe non vide',
				liste: [questionFournie('question applicable')],
			},
			groupeVide: {
				titre: () => 'groupe vide',
				liste: [
					questionFournie(
						'question non applicable',
						(s) => !!s && 'salarié' in s && s.salarié === 'oui'
					),
				],
			},
		}

		const { result } = renderHook(() =>
			useQuestionsÉditorialisées({
				groupesDeQuestionsFournies,
				situation: {
					_tag: 'Situation',
					salarié: 'non',
				} as Situation,
			})
		)

		expect(Record.keys(result.current.groupesDeQuestions)).toEqual([
			'groupeNonVide',
		])
	})
})
