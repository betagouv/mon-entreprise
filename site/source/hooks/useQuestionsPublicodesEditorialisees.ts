import { Predicate } from 'effect/Predicate'
import * as R from 'effect/Record'
import { TFunction } from 'i18next'

import { DottedName } from '@/domaine/publicodes/DottedName'
import { NomModèle, QuestionsGroupées } from '@/domaine/SimulationConfig'
import { Situation } from '@/domaine/Situation'

import { useEngineFromModèle } from './useEngineFromModèle'

export type GroupeDeQuestionsPublicodes<S extends Situation> = {
	titre: (t: TFunction) => string
	liste: QuestionPublicodes<S>[]
}

export interface QuestionPublicodes<S extends Situation> {
	_tag: 'QuestionPublicodes'
	id: DottedName
	libellé: (t: TFunction) => string
	applicable: Predicate<S | undefined>
	répondue: Predicate<S | undefined>
}

export function useQuestionsPublicodesÉditorialisées<S extends Situation>(
	nomModèle: NomModèle,
	questionsGroupées: Record<string, QuestionsGroupées>
): Record<string, QuestionsPublicodesGroupées<S>> {
	const engine = useEngineFromModèle(nomModèle)

	return R.map(questionsGroupées, ({ titre, liste }) => {
		return {
			titre,
			liste: liste.map(({ libellé, dottedName }) => {
				const evaluation = engine.evaluate(dottedName)
				const applicable = () =>
					engine.evaluate({
						'est applicable': dottedName,
					}).nodeValue === true && evaluation.nodeValue !== null
				const répondue = () =>
					!(dottedName in evaluation.missingVariables) &&
					evaluation.nodeValue !== undefined

				return {
					_tag: 'QuestionPublicodes',
					id: dottedName,
					libellé,
					applicable,
					répondue,
				}
			}),
		}
	})
}
