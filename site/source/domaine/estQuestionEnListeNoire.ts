import { DottedName } from 'modele-social'

import { SimulationConfig } from '@/domaine/SimulationConfig'

export const estQuestionEnListeNoire =
	(config: SimulationConfig) =>
	(question: DottedName): boolean =>
		config.questions?.['liste noire']?.some((préfixe) =>
			question.startsWith(préfixe)
		) ?? false
