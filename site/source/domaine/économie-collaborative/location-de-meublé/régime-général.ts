import { Either, Option, pipe } from 'effect'

import { SEUIL_PROFESSIONNALISATION } from '@/domaine/économie-collaborative/location-de-meublé/constantes'
import {
	RecettesInférieuresAuSeuilRequisPourCeRégime,
	RecettesSupérieuresAuPlafondAutoriséPourCeRégime,
} from '@/domaine/économie-collaborative/location-de-meublé/erreurs'
import { RegimeCotisation } from '@/domaine/économie-collaborative/location-de-meublé/situation'
import {
	abattement,
	estPlusGrandQue,
	estPlusPetitQue,
	EuroParAn,
	eurosParAn,
	fois,
	moins,
} from '@/domaine/Montant'

import { DEFAULTS } from './cotisations'
import { SituationLocationCourteDureeValide } from './situation'

export const PLAFOND_REGIME_GENERAL = eurosParAn(77_700)
export const TAUX_COTISATION_RG_NORMAL = 0.4742
export const TAUX_COTISATION_RG_ALSACE_MOSELLE = 0.4872
export const ABATTEMENT_REGIME_GENERAL = 0.6

/**
 * Calcule les cotisations sociales pour le régime général
 * @param situation La situation avec des recettes obligatoirement définies
 * @returns Un Either contenant soit les cotisations calculées, soit une erreur explicite
 */
export function calculeCotisationsRégimeGénéral(
	situation: SituationLocationCourteDureeValide
): Either.Either<
	EuroParAn,
	| RecettesInférieuresAuSeuilRequisPourCeRégime
	| RecettesSupérieuresAuPlafondAutoriséPourCeRégime
> {
	const recettes = situation.recettes.value

	const estAlsaceMoselle = Option.getOrElse(
		situation.estAlsaceMoselle,
		() => DEFAULTS.EST_ALSACE_MOSELLE
	)

	const premièreAnnée = Option.getOrElse(
		situation.premièreAnnée,
		() => DEFAULTS.PREMIERE_ANNEE
	)

	if (pipe(recettes, estPlusPetitQue(SEUIL_PROFESSIONNALISATION))) {
		return Either.left(
			new RecettesInférieuresAuSeuilRequisPourCeRégime({
				recettes,
				seuil: SEUIL_PROFESSIONNALISATION,
				régime: RegimeCotisation.regimeGeneral,
			})
		)
	}

	if (pipe(recettes, estPlusGrandQue(PLAFOND_REGIME_GENERAL))) {
		return Either.left(
			new RecettesSupérieuresAuPlafondAutoriséPourCeRégime({
				recettes,
				plafond: PLAFOND_REGIME_GENERAL,
				régime: RegimeCotisation.regimeGeneral,
			})
		)
	}

	const assiette = premièreAnnée
		? pipe(recettes, estPlusGrandQue(SEUIL_PROFESSIONNALISATION))
			? pipe(recettes, moins(SEUIL_PROFESSIONNALISATION))
			: eurosParAn(0)
		: recettes

	const taux = estAlsaceMoselle
		? TAUX_COTISATION_RG_ALSACE_MOSELLE
		: TAUX_COTISATION_RG_NORMAL

	const cotisations = pipe(
		assiette,
		abattement(ABATTEMENT_REGIME_GENERAL),
		fois(taux)
	)

	return Either.right(cotisations)
}