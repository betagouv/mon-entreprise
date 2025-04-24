import { Either, pipe } from 'effect'

import { SEUIL_PROFESSIONNALISATION } from '@/domaine/économie-collaborative/location-de-meublé/constantes'
import { RecettesInférieuresAuSeuilRequisPourCeRégime } from '@/domaine/économie-collaborative/location-de-meublé/erreurs'
import { RegimeCotisation } from '@/domaine/économie-collaborative/location-de-meublé/situation'
import { evalueAvecPublicodes } from '@/domaine/engine/engineSingleton'
import { estPlusPetitQue, EuroParAn, eurosParAn } from '@/domaine/Montant'
import {
	AutoEntrepreneurChiffreAffaireDansPublicodes,
	AutoEntrepreneurContexteDansPublicodes,
	AutoEntrepreneurCotisationsEtContributionsDansPublicodes,
} from '@/domaine/publicodes/AutoEntrepreneurContexteDansPublicodes'

import { SituationLocationCourteDureeValide } from './situation'

/**
 * Calcule les cotisations sociales pour le régime micro-entreprise
 * @param situation La situation avec des recettes obligatoirement définies
 * @returns Un Either contenant soit les cotisations calculées, soit une erreur explicite
 */
export function calculeCotisationsMicroEntreprise(
	situation: SituationLocationCourteDureeValide
): Either.Either<EuroParAn, RecettesInférieuresAuSeuilRequisPourCeRégime> {
	const recettes = situation.recettes.value

	if (pipe(recettes, estPlusPetitQue(SEUIL_PROFESSIONNALISATION))) {
		return Either.left(
			new RecettesInférieuresAuSeuilRequisPourCeRégime({
				recettes,
				seuil: SEUIL_PROFESSIONNALISATION,
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
