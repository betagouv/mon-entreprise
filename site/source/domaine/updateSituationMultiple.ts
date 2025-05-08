import { pipe } from 'effect'
import * as O from 'effect/Option'
import * as R from 'effect/Record'
import { DottedName } from 'modele-social'

import {
	RèglePublicodeAdapter,
	ValeurPublicodes,
} from '@/domaine/engine/RèglePublicodeAdapter'
import { SimulationConfig } from '@/domaine/SimulationConfig'
import { SituationPublicodes } from '@/domaine/SituationPublicodes'
import { ImmutableType } from '@/types/utils'

export function updateSituationMultiple(
	config: ImmutableType<SimulationConfig>,
	currentSituation: SituationPublicodes,
	préfixe: DottedName,
	valeurs: Record<string, ValeurPublicodes>
): SituationPublicodes {
	const nouvellesValeurs = pipe(
		valeurs,
		R.mapKeys((suffixe) => `${préfixe} . ${suffixe}`),
		R.map((valeur) => RèglePublicodeAdapter.encode(O.some(valeur)))
	)

	return { ...currentSituation, ...nouvellesValeurs }
}
