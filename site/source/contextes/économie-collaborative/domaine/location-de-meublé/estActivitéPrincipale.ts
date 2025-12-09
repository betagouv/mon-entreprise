import { pipe } from 'effect'

import { estPlusGrandOuÉgalÀ } from '@/domaine/Montant'

import { SituationMeubléAvecAutresRevenus } from './situation'

export function estActivitéPrincipale(
	situation: SituationMeubléAvecAutresRevenus
): boolean {
	const recettes = situation.recettes.value
	const autresRevenus = situation.autresRevenus.value

	return pipe(recettes, estPlusGrandOuÉgalÀ(autresRevenus))
}
