import { Predicate } from 'effect/Predicate'

import { DottedName } from '@/domaine/publicodes/DottedName'
import { NomModèle } from '@/domaine/SimulationConfig'
import { Situation } from '@/domaine/Situation'

import { useEngineFromModèle } from './useEngineFromModèle'

export interface QuestionPublicodes<S extends Situation> {
	_tag: 'QuestionPublicodes'
	id: DottedName
	libellé: () => string
	applicable: Predicate<S | undefined>
	répondue: Predicate<S | undefined>
}

export function useQuestionsPublicodes<S extends Situation>(
	nomModèle: NomModèle,
	idsDesQuestions: DottedName[]
): QuestionPublicodes<S>[] {
	const engine = useEngineFromModèle(nomModèle)

	return idsDesQuestions.map((id: DottedName) => {
		const evaluation = engine.evaluate(id)
		const libellé = () => engine.getRule(id).title
		const applicable = () =>
			engine.evaluate({
				'est applicable': id,
			}).nodeValue === true && evaluation.nodeValue !== null
		const répondue = () =>
			!(id in evaluation.missingVariables) && evaluation.nodeValue !== undefined

		return {
			_tag: 'QuestionPublicodes',
			id,
			libellé,
			applicable,
			répondue,
		}
	})
}
