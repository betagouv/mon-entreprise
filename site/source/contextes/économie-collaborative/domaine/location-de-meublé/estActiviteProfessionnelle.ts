import { Either, pipe } from 'effect'

import { PLAFOND_ANNUEL_SECURITE_SOCIALE } from '@/domaine/ConstantesSociales'
import { estPlusGrandOuÉgalÀ, eurosParAn } from '@/domaine/Montant'

import { AffiliationObligatoire } from './erreurs'
import { SituationÉconomieCollaborativeValide } from './situation'

export const SEUIL_PROFESSIONNALISATION = {
	MEUBLÉ: eurosParAn(23_000),
	CHAMBRE_HÔTE: eurosParAn(PLAFOND_ANNUEL_SECURITE_SOCIALE * 0.13),
} as const

/**
 * Détermine si l'activité est considérée comme professionnelle selon les recettes
 * @param situation La situation avec des recettes ou du revenu net
 * @returns true si les recettes/revenu sont supérieures ou égales au seuil de professionnalisation
 */
export function estActiviteProfessionnelle(
	situation: SituationÉconomieCollaborativeValide
): boolean {
	if (situation.typeHébergement === 'chambre-hôte') {
		return pipe(
			situation.revenuNet.value,
			estPlusGrandOuÉgalÀ(SEUIL_PROFESSIONNALISATION.CHAMBRE_HÔTE)
		)
	}

	return pipe(
		situation.recettes.value,
		estPlusGrandOuÉgalÀ(SEUIL_PROFESSIONNALISATION.MEUBLÉ)
	)
}

/**
 * Vérifie que l'activité n'est pas professionnelle
 * @param situation La situation avec des recettes ou du revenu net
 * @returns Right(situation) si l'activité n'est pas professionnelle, Left(AffiliationObligatoire) sinon
 */
export function vérifieActivitéNonProfessionnelle(
	situation: SituationÉconomieCollaborativeValide
): Either.Either<SituationÉconomieCollaborativeValide, AffiliationObligatoire> {
	if (!estActiviteProfessionnelle(situation)) {
		return Either.right(situation)
	}

	const { montant, seuil } =
		situation.typeHébergement === 'chambre-hôte'
			? {
					montant: situation.revenuNet.value,
					seuil: SEUIL_PROFESSIONNALISATION.CHAMBRE_HÔTE,
			  }
			: {
					montant: situation.recettes.value,
					seuil: SEUIL_PROFESSIONNALISATION.MEUBLÉ,
			  }

	return Either.left(
		new AffiliationObligatoire({
			recettes: montant,
			seuil,
		})
	)
}
