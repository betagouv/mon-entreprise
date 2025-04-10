import { pipe } from 'effect'
import { isString } from 'effect/Predicate'
import * as R from 'effect/Record'
import { DottedName } from 'modele-social'
import { PublicodesExpression } from 'publicodes'

import { SimulationConfig } from '@/domaine/SimulationConfig'
import { SituationPublicodes } from '@/domaine/SituationPublicodes'
import { ImmutableType } from '@/types/utils'

export function updateSituationMultiple(
	config: ImmutableType<SimulationConfig>,
	currentSituation: SituationPublicodes,
	préfixe: DottedName,
	valeurs: Record<string, PublicodesExpression>
): SituationPublicodes {
	const nouvellesValeurs = pipe(
		valeurs,
		R.mapKeys((suffixe) => `${préfixe} . ${suffixe}`),
		R.map((valeur) => (isString(valeur) ? `'${valeur}'` : valeur)) // 😭
	)

	return { ...currentSituation, ...nouvellesValeurs }
}
