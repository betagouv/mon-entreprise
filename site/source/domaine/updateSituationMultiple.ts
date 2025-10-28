import { pipe } from 'effect'
import * as O from 'effect/Option'
import * as R from 'effect/Record'

import {
	PublicodesAdapter,
	ValeurPublicodes,
} from '@/domaine/engine/PublicodesAdapter'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { SituationPublicodes } from '@/domaine/SituationPublicodes'

/**
 * Enregistre une question à choix multiple
 * i.e. met à jour une liste de sous-règles
 * NB: ne gère pas le cas où la règle parente est un objectif exclusif
 * (réinitilisation des autres objectifs exclusifs nécessaire)
 */
export function updateSituationMultiple(
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
