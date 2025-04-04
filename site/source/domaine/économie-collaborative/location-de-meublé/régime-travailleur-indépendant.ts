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

import { SituationLocationCourteDuree } from './situation'

export function calculeCotisationsTravailleurIndépendant(
	situation: SituationLocationCourteDuree
): Either.Either<EuroParAn, RecettesInférieuresAuSeuilRequisPourCeRégime> {
	const { recettes } = situation

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
