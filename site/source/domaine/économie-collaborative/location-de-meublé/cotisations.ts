import { Either, Option } from 'effect'

import {
	SimulationImpossible,
	SituationIncomplète,
} from '@/domaine/économie-collaborative/location-de-meublé/erreurs'
import { calculeCotisationsRégimeGénéral } from '@/domaine/économie-collaborative/location-de-meublé/régime-général'
import { calculeCotisationsMicroEntreprise } from '@/domaine/économie-collaborative/location-de-meublé/régime-micro-entreprise'
import { calculeCotisationsTravailleurIndépendant } from '@/domaine/économie-collaborative/location-de-meublé/régime-travailleur-indépendant'
import {
	estSituationValide,
	RegimeCotisation,
	SituationLocationCourteDuree,
} from '@/domaine/économie-collaborative/location-de-meublé/situation'
import { EuroParAn } from '@/domaine/Montant'

export const DEFAULTS = {
	RÉGIME_PAR_DÉFAUT: 'travailleur-indépendant' as RegimeCotisation,
	EST_ALSACE_MOSELLE: false,
	PREMIERE_ANNEE: false,
}

/**
 * Calcule les cotisations sociales selon le régime spécifié dans la situation
 * @param situation La situation avec des champs optionnels
 * @returns Un Either contenant soit les cotisations calculées, soit une erreur explicite
 */
export function calculeCotisations(
	situation: SituationLocationCourteDuree
): Either.Either<EuroParAn, SimulationImpossible> {
	if (!estSituationValide(situation)) {
		return Either.left(
			new SituationIncomplète({
				message:
					'Impossible de calculer les cotisations sans connaître les recettes',
			})
		)
	}

	const regimeCotisation = Option.getOrElse(
		situation.regimeCotisation,
		() => DEFAULTS.RÉGIME_PAR_DÉFAUT
	)

	switch (regimeCotisation) {
		case 'régime-général':
			return calculeCotisationsRégimeGénéral(situation)
		case 'micro-entreprise':
			return calculeCotisationsMicroEntreprise(situation)
		case 'travailleur-indépendant':
			return calculeCotisationsTravailleurIndépendant(situation)
	}
}
