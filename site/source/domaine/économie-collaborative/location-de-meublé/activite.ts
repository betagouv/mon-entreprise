import { pipe } from 'effect'

import { SEUIL_PROFESSIONNALISATION } from '@/domaine/économie-collaborative/location-de-meublé/constantes'
import { SituationLocationCourteDuree } from '@/domaine/économie-collaborative/location-de-meublé/situation'
import { estPlusGrandOuÉgalÀ } from '@/domaine/Montant'

/**
 * Détermine si l'activité est considérée comme professionnelle selon les recettes
 * @param situation La situation avec les recettes
 * @returns Vrai si les recettes sont supérieures ou égales au seuil de professionnalisation
 */
export function estActiviteProfessionnelle(
	situation: SituationLocationCourteDuree
): boolean {
	return pipe(
		situation.recettes,
		estPlusGrandOuÉgalÀ(SEUIL_PROFESSIONNALISATION)
	)
}
