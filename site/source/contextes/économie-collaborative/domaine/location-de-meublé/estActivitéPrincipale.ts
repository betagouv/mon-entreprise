import { pipe } from 'effect'
import * as Option from 'effect/Option'

import { estPlusGrandOuÉgalÀ } from '@/domaine/Montant'

import {
	SituationMeubléDeTourismeValide,
	situationParDéfaut,
} from './situation'

export function estActivitéPrincipale(
	situation: SituationMeubléDeTourismeValide
): boolean {
	const recettes = situation.recettes.value

	const autresRevenus = Option.getOrElse(
		situation.autresRevenus,
		() => situationParDéfaut.autresRevenus
	)

	return pipe(recettes, estPlusGrandOuÉgalÀ(autresRevenus))
}
