import { DottedName } from '@/domaine/publicodes/DottedName'
import { SimulationConfig } from '@/domaine/SimulationConfig'

export const estQuestionEnListeNoire =
	(config: SimulationConfig) =>
	(question: DottedName): boolean =>
		config.questions?.['liste noire']?.some((préfixe) =>
			question.startsWith(préfixe)
		) ?? false
