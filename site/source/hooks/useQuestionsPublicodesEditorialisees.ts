import * as R from 'effect/Record'
import { TFunction } from 'i18next'
import { useCallback } from 'react'

import { DottedName } from '@/domaine/publicodes/DottedName'
import { NomModèle, Question } from '@/domaine/SimulationConfig'

import { useEngineFromModèle } from './useEngineFromModèle'

export type GroupeDeQuestionsPublicodes = {
	titre: (t: TFunction) => string
	liste: QuestionPublicodes[]
}

export interface QuestionPublicodes {
	_tag: 'QuestionPublicodes'
	id: DottedName
	libellé: (t: TFunction) => string
	applicable: () => boolean
	répondue: () => boolean
}

export function useQuestionsPublicodesÉditorialisées(
	nomModèle: NomModèle,
	questionsPrincipales: Question[],
	groupesDeQuestions: Record<
		string,
		{
			titre: (t: TFunction) => string
			liste: Question[]
		}
	>
): {
	questionsPublicodesPrincipales: QuestionPublicodes[]
	groupesDeQuestionsPublicodes: Record<string, GroupeDeQuestionsPublicodes>
} {
	const engine = useEngineFromModèle(nomModèle)

	const toQuestionPublicodes = useCallback(
		(question: Question) => {
			const evaluation = engine.evaluate(question.dottedName)
			const applicable = () =>
				engine.evaluate({
					'est applicable': question.dottedName,
				}).nodeValue === true && evaluation.nodeValue !== null
			const répondue = () =>
				!(question.dottedName in evaluation.missingVariables) &&
				evaluation.nodeValue !== undefined

			return {
				_tag: 'QuestionPublicodes',
				id: question.dottedName,
				libellé: question.libellé,
				applicable,
				répondue,
			} satisfies QuestionPublicodes
		},
		[engine]
	)

	return {
		questionsPublicodesPrincipales:
			questionsPrincipales.map(toQuestionPublicodes),
		groupesDeQuestionsPublicodes: R.map(
			groupesDeQuestions,
			({ titre, liste }) => {
				return {
					titre,
					liste: liste.map(toQuestionPublicodes),
				}
			}
		),
	}
}
