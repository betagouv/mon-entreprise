import { Either, pipe } from 'effect'

import { SEUIL_PROFESSIONNALISATION } from '@/domaine/économie-collaborative/location-de-meublé/constantes'
import { RecettesInférieuresAuSeuilRequisPourCeRégime } from '@/domaine/économie-collaborative/location-de-meublé/erreurs'
import { evalueAvecPublicodes } from '@/domaine/engine/engineSingleton'
import { estPlusPetitQue, EuroParAn, eurosParAn } from '@/domaine/Montant'
import {
	TravailleurIndependantChiffreAffaireDansPublicodes,
	TravailleurIndependantContexteDansPublicodes,
	TravailleurIndependantCotisationsEtContributionsDansPublicodes,
} from '@/domaine/publicodes/TravailleurIndependantContexteDansPublicodes'

import { SituationLocationCourteDureeValide } from './situation'

/**
 * Calcule les cotisations sociales pour le régime travailleur indépendant
 * @param situation La situation avec des recettes obligatoirement définies
 * @returns Un Either contenant soit les cotisations calculées, soit une erreur explicite
 */
export function calculeCotisationsTravailleurIndépendant(
	situation: SituationLocationCourteDureeValide
): Either.Either<EuroParAn, RecettesInférieuresAuSeuilRequisPourCeRégime> {
	const recettes = situation.recettes.value

	if (pipe(recettes, estPlusPetitQue(SEUIL_PROFESSIONNALISATION))) {
		return Either.left(
			new RecettesInférieuresAuSeuilRequisPourCeRégime({
				recettes,
				seuil: SEUIL_PROFESSIONNALISATION,
				régime: 'travailleur-indépendant',
			})
		)
	}

	const cotisations = evalueAvecPublicodes<number>(
		{
			...TravailleurIndependantContexteDansPublicodes,
			...TravailleurIndependantChiffreAffaireDansPublicodes.fromMontant(
				recettes
			),
		},
		TravailleurIndependantCotisationsEtContributionsDansPublicodes.enEurosParAn
	)

	return Either.right(eurosParAn(cotisations))
}
