import { Either } from 'effect'

import { RégimeInapplicable } from '@/domaine/économie-collaborative/location-de-meublé/erreurs'
import { calculeCotisationsRégimeGénéral } from '@/domaine/économie-collaborative/location-de-meublé/régime-général'
import { calculeCotisationsMicroEntreprise } from '@/domaine/économie-collaborative/location-de-meublé/régime-micro-entreprise'
import { calculeCotisationsTravailleurIndépendant } from '@/domaine/économie-collaborative/location-de-meublé/régime-travailleur-indépendant'
import { SituationLocationCourteDuree } from '@/domaine/économie-collaborative/location-de-meublé/situation'
import { EuroParAn } from '@/domaine/Montant'

/**
 * Calcule les cotisations sociales selon le régime spécifié dans la situation
 * @param situation La situation avec un régime de cotisation optionnel (travailleur-indépendant par défaut)
 * @returns Un Either contenant soit les cotisations calculées, soit une erreur explicite
 */
export function calculeCotisations(
	situation: SituationLocationCourteDuree
): Either.Either<EuroParAn, RégimeInapplicable> {
	const { regimeCotisation } = situation

	switch (regimeCotisation) {
		case 'régime-général':
			return calculeCotisationsRégimeGénéral(situation)

		case 'micro-entreprise':
			return calculeCotisationsMicroEntreprise(situation)

		case 'travailleur-indépendant':
		default:
			return calculeCotisationsTravailleurIndépendant(situation)
	}
}
