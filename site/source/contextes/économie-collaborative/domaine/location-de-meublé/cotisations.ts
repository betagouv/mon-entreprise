import { Either, Option } from 'effect'

import {
	SimulationImpossible,
	SituationIncomplète,
} from '@/contextes/économie-collaborative/domaine/location-de-meublé/erreurs'
import { calculeCotisationsRégimeGénéral } from '@/contextes/économie-collaborative/domaine/location-de-meublé/régime-général'
import { calculeCotisationsTravailleurIndépendant } from '@/contextes/économie-collaborative/domaine/location-de-meublé/régime-travailleur-indépendant'
import {
	estSituationValide,
	RegimeCotisation,
	SituationÉconomieCollaborative,
} from '@/contextes/économie-collaborative/domaine/location-de-meublé/situation'
import { Montant } from '@/domaine/Montant'

import { calculeCotisationsMicroEntreprise } from './régime-micro-entreprise'

export const DEFAULTS = {
	RÉGIME_PAR_DÉFAUT: RegimeCotisation.travailleurIndependant,
	EST_ALSACE_MOSELLE: false,
	PREMIERE_ANNEE: false,
}

/**
 * Calcule les cotisations sociales selon le régime spécifié dans la situation
 * @param situation La situation avec des champs optionnels
 * @returns Un Either contenant soit les cotisations calculées, soit une erreur explicite
 */
export function calculeCotisations(
	situation: SituationÉconomieCollaborative
): Either.Either<Montant<'€/an'>, SimulationImpossible> {
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
		case RegimeCotisation.regimeGeneral:
			return calculeCotisationsRégimeGénéral(situation)
		case RegimeCotisation.microEntreprise:
			return calculeCotisationsMicroEntreprise(situation)
		case RegimeCotisation.travailleurIndependant:
			return calculeCotisationsTravailleurIndépendant(situation)
	}
}
