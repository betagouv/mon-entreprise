import { Either, pipe } from 'effect'

import { SEUIL_PROFESSIONNALISATION } from '@/contextes/économie-collaborative/domaine/location-de-meublé/constantes'
import { RecettesInférieuresAuSeuilRequisPourCeRégime } from '@/contextes/économie-collaborative/domaine/location-de-meublé/erreurs'
import { evalueAvecPublicodes } from '@/domaine/engine/engineSingleton'
import { estPlusPetitQue, eurosParAn, Montant } from '@/domaine/Montant'
import {
	AutoEntrepreneurChiffreAffaireDansPublicodes,
	AutoEntrepreneurContexteDansPublicodes,
	AutoEntrepreneurCotisationsEtContributionsDansPublicodes,
} from '@/domaine/publicodes/AutoEntrepreneurContexteDansPublicodes'

import {
	RegimeCotisation,
	SituationÉconomieCollaborativeValide,
} from './situation'

/**
 * Calcule les cotisations sociales pour le régime micro-entreprise
 * @param situation La situation avec des recettes obligatoirement définies
 * @returns Un Either contenant soit les cotisations calculées, soit une erreur explicite
 */
export function calculeCotisationsMicroEntreprise(
	situation: SituationÉconomieCollaborativeValide
): Either.Either<
	Montant<'€/an'>,
	RecettesInférieuresAuSeuilRequisPourCeRégime
> {
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
