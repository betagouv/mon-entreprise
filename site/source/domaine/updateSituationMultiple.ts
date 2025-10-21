import { pipe } from 'effect'
import * as O from 'effect/Option'
import * as R from 'effect/Record'

import {
	PublicodesAdapter,
	ValeurPublicodes,
} from '@/domaine/engine/PublicodesAdapter'
import { DottedName } from '@/domaine/publicodes/DottedName'
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
		R.map((valeur) => PublicodesAdapter.encode(O.some(valeur)))
	)

	return { ...currentSituation, ...nouvellesValeurs }
}
