import { Either, pipe } from 'effect'

import { SEUIL_PROFESSIONNALISATION } from '@/domaine/économie-collaborative/location-de-meublé/constantes'
import {
	RecettesInférieuresAuSeuilRequisPourCeRégime,
	RecettesSupérieuresAuPlafondAutoriséPourCeRégime,
} from '@/domaine/économie-collaborative/location-de-meublé/erreurs'
import {
	abattement,
	estPlusGrandQue,
	estPlusPetitQue,
	EuroParAn,
	eurosParAn,
	fois,
	moins,
} from '@/domaine/Montant'

import { SituationLocationCourteDuree } from './situation'

export const PLAFOND_REGIME_GENERAL = eurosParAn(77_700)

export const TAUX_COTISATION_RG_NORMAL = 0.4742
export const TAUX_COTISATION_RG_ALSACE_MOSELLE = 0.4872
export const ABATTEMENT_REGIME_GENERAL = 0.6

export function calculeCotisationsRégimeGénéral(
	situation: SituationLocationCourteDuree
): Either.Either<
	EuroParAn,
	| RecettesInférieuresAuSeuilRequisPourCeRégime
	| RecettesSupérieuresAuPlafondAutoriséPourCeRégime
> {
	const {
		recettes,
		estAlsaceMoselle = false,
		premièreAnnée = false,
	} = situation

	if (pipe(recettes, estPlusPetitQue(SEUIL_PROFESSIONNALISATION))) {
		return Either.left(
			new RecettesInférieuresAuSeuilRequisPourCeRégime({
				recettes,
				seuil: SEUIL_PROFESSIONNALISATION,
				régime: 'régime-général',
			})
		)
	}

	if (pipe(recettes, estPlusGrandQue(PLAFOND_REGIME_GENERAL))) {
		return Either.left(
			new RecettesSupérieuresAuPlafondAutoriséPourCeRégime({
				recettes,
				plafond: PLAFOND_REGIME_GENERAL,
				régime: 'régime-général',
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
