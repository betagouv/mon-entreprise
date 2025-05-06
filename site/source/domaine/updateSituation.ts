import { DottedName } from 'modele-social'
import { PublicodesExpression } from 'publicodes'

import { ImmutableType } from '@/types/utils'
import { objectTransform, omit } from '@/utils'

import { SimulationConfig } from './SimulationConfig'
import { Situation } from './Situation'

export function updateSituation(
	config: ImmutableType<SimulationConfig>,
	currentSituation: Situation,
	dottedName: DottedName,
	value: PublicodesExpression | undefined
): Situation {
	if (value === undefined) {
		return omit(currentSituation, dottedName)
	}

	const objectifsExclusifs = config['objectifs exclusifs'] ?? []

	if (!objectifsExclusifs.includes(dottedName)) {
		return { ...currentSituation, [dottedName]: value }
	}

	const objectifsToReset = objectifsExclusifs.filter(
		(name) => name !== dottedName
	)

	const clearedSituation = objectTransform(currentSituation, (entries) =>
		entries.filter(
			([dottedName]) => !objectifsToReset.includes(dottedName as DottedName)
		)
	)

	return { ...clearedSituation, [dottedName]: value }
}
