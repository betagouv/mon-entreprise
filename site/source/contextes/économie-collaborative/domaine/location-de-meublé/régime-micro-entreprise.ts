import { Either, Option, pipe } from 'effect'

import { evalueAvecPublicodes } from '@/domaine/engine/engineSingleton'
import { estPlusGrandQue, eurosParAn, Montant } from '@/domaine/Montant'
import {
	AutoEntrepreneurChiffreAffaireDansPublicodes,
	AutoEntrepreneurContexteDansPublicodes,
	AutoEntrepreneurCotisationsEtContributionsDansPublicodes,
} from '@/domaine/publicodes/AutoEntrepreneurContexteDansPublicodes'

import { RecettesSupérieuresAuPlafondAutoriséPourCeRégime } from './erreurs'
import {
	RegimeCotisation,
	SituationÉconomieCollaborativeValide,
	TypeLocation,
} from './situation'

export const PLAFOND_MICRO_ENTREPRISE_NON_CLASSE = eurosParAn(77_700)
export const PLAFOND_MICRO_ENTREPRISE_TOURISME = eurosParAn(188_700)
export const PLAFOND_MICRO_ENTREPRISE_CHAMBRE_HOTE = eurosParAn(188_700)

/**
 * Calcule les cotisations sociales pour le régime micro-entreprise
 * @param situation La situation avec des recettes
 * @returns Un Either contenant soit les cotisations calculées, soit une erreur
 */
export function calculeCotisationsMicroEntreprise(
	situation: SituationÉconomieCollaborativeValide
): Either.Either<
	Montant<'€/an'>,
	RecettesSupérieuresAuPlafondAutoriséPourCeRégime
> {
	const recettes = situation.recettes.value

	const typeLocation = Option.getOrElse(
		situation.typeLocation,
		(): TypeLocation => 'non-classé'
	)

	const plafond =
		typeLocation === 'non-classé'
			? PLAFOND_MICRO_ENTREPRISE_NON_CLASSE
			: typeLocation === 'tourisme'
			? PLAFOND_MICRO_ENTREPRISE_TOURISME
			: PLAFOND_MICRO_ENTREPRISE_CHAMBRE_HOTE

	if (pipe(recettes, estPlusGrandQue(plafond))) {
		return Either.left(
			new RecettesSupérieuresAuPlafondAutoriséPourCeRégime({
				recettes,
				plafond,
				régime: RegimeCotisation.microEntreprise,
			})
		)
	}

	const cotisations = evalueAvecPublicodes<number>(
		{
			...AutoEntrepreneurContexteDansPublicodes,
			...AutoEntrepreneurChiffreAffaireDansPublicodes.fromMontant(recettes),
		},
		AutoEntrepreneurCotisationsEtContributionsDansPublicodes.enEurosParAn
	)

	return Either.right(eurosParAn(cotisations))
}
