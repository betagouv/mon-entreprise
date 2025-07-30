import { DottedName } from 'modele-social'
import Engine from 'publicodes'

import { QuestionRépondue } from '@/store/reducers/simulation.reducer'

export const estCeQueLaQuestionPublicodesEstRépondue =
	(engine: Engine<DottedName>, questionsRépondues: QuestionRépondue[]) =>
	(dottedName: DottedName): boolean => {
		const estDirectementRépondue = questionsRépondues.some(
			(q) => q.règle === dottedName
		)
		if (estDirectementRépondue) {
			return true
		}

		const rule = engine.getRule(dottedName)
		const plusieursPossibilités = rule.rawNode['plusieurs possibilités']
		const estPlusieursPossibilités =
			Array.isArray(plusieursPossibilités) && plusieursPossibilités.length > 0

		if (estPlusieursPossibilités) {
			return questionsRépondues.some((q) =>
				q.règle.startsWith(dottedName + ' . ')
			)
		}

		return false
	}
