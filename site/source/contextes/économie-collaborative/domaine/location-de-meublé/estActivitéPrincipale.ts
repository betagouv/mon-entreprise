import { pipe } from 'effect'
import * as Option from 'effect/Option'

import { estPlusGrandOuÉgalÀ } from '@/domaine/Montant'

import {
	SituationÉconomieCollaborativeValide,
	situationParDéfaut,
} from './situation'

export function estActivitéPrincipale(
	situation: SituationÉconomieCollaborativeValide
): boolean {
	const recettes = situation.recettes.value

	const autresRevenus = Option.getOrElse(
		situation.autresRevenus,
		() => situationParDéfaut.autresRevenus
	)

	return pipe(recettes, estPlusGrandOuÉgalÀ(autresRevenus))
}
