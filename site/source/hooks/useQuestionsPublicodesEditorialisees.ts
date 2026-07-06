import * as R from 'effect/Record'
import { TFunction } from 'i18next'
import Engine from 'publicodes'
import { useCallback } from 'react'

import {
	GroupeDeQuestionsPublicodes,
	QuestionPublicodes,
} from '@/domaine/questions'
import { NomModèle, Question } from '@/domaine/SimulationConfig'

import { useEngineFromModèle } from './useEngineFromModèle'

export function useQuestionsPublicodesÉditorialisées(
	nomModèle: NomModèle,
	questionsPrincipales: Question[],
	groupesDeQuestions: Record<
		string,
		{
			titre: (t: TFunction) => string
			réponse?: (engine: Engine, t: TFunction) => string
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

			return {
				_tag: 'QuestionPublicodes',
				id: question.dottedName,
				libellé: question.libellé,
				applicable,
			} satisfies QuestionPublicodes
		},
		[engine]
	)

	return {
		questionsPublicodesPrincipales:
			questionsPrincipales.map(toQuestionPublicodes),
		groupesDeQuestionsPublicodes: R.map(
			groupesDeQuestions,
			({ titre, réponse, liste }) => {
				return {
					titre,
					réponse,
					liste: liste.map(toQuestionPublicodes),
				}
			}
		),
	}
}
