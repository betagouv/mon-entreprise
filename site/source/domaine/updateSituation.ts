import * as O from 'effect/Option'
import { DottedName } from 'modele-social'

import {
	RèglePublicodeAdapter,
	ValeurPublicodes,
} from '@/domaine/engine/RèglePublicodeAdapter'
import { ImmutableType } from '@/types/utils'
import { objectTransform, omit } from '@/utils'

import { SimulationConfig } from './SimulationConfig'
import { SituationPublicodes } from './SituationPublicodes'

export function updateSituation(
	config: ImmutableType<SimulationConfig>,
	currentSituation: SituationPublicodes,
	dottedName: DottedName,
	value: ValeurPublicodes | undefined
): SituationPublicodes {
	if (value === undefined) {
		return omit(currentSituation, dottedName)
	}

	const objectifsExclusifs = config['objectifs exclusifs'] ?? []

	const encoded = RèglePublicodeAdapter.encode(O.some(value))

	if (!objectifsExclusifs.includes(dottedName)) {
		return {
			...currentSituation,
			[dottedName]: encoded,
		}
	}

	const objectifsToReset = objectifsExclusifs.filter(
		(name) => name !== dottedName
	)

	const clearedSituation = objectTransform(currentSituation, (entries) =>
		entries.filter(
			([dottedName]) => !objectifsToReset.includes(dottedName as DottedName)
		)
	)

	return {
		...clearedSituation,
		[dottedName]: encoded,
	}
}
