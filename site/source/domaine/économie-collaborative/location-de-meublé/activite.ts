import { pipe } from 'effect'

import { SEUIL_PROFESSIONNALISATION } from '@/domaine/économie-collaborative/location-de-meublé/constantes'
import { SituationLocationCourteDureeValide } from '@/domaine/économie-collaborative/location-de-meublé/situation'
import { estPlusGrandOuÉgalÀ } from '@/domaine/Montant'

/**
 * Détermine si l'activité est considérée comme professionnelle selon les recettes
 * @param situation La situation avec des recettes obligatoirement définies
 * @returns Vrai si les recettes sont supérieures ou égales au seuil de professionnalisation
 */
export function estActiviteProfessionnelle(
	situation: SituationLocationCourteDureeValide
): boolean {
	return pipe(
		situation.recettes.value,
		estPlusGrandOuÉgalÀ(SEUIL_PROFESSIONNALISATION)
	)
}
