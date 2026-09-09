import { Either, pipe } from 'effect'

import { RecettesInférieuresAuSeuilRequisPourCeRégime } from '@/contextes/économie-collaborative/domaine/location-de-meublé/erreurs'
import { evalueAvecPublicodes } from '@/domaine/engine/engineSingleton'
import { estPlusPetitQue, eurosParAn, Montant } from '@/domaine/Montant'
import {
	TravailleurIndependantChiffreAffaireDansPublicodes,
	TravailleurIndependantContexteDansPublicodes,
	TravailleurIndependantCotisationsEtContributionsDansPublicodes,
} from '@/domaine/publicodes/TravailleurIndependantContexteDansPublicodes'

import { SEUIL_PROFESSIONNALISATION } from './constantes'
import {
	RegimeCotisation,
	SituationÉconomieCollaborativeValide,
} from './situation'

/**
 * Calcule les cotisations sociales pour le régime travailleur indépendant
 * @param situation La situation avec des recettes obligatoirement définies
 * @returns Un Either contenant soit les cotisations calculées, soit une erreur explicite
 */
export function calculeCotisationsTravailleurIndépendant(
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
				régime: RegimeCotisation.travailleurIndependant,
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
