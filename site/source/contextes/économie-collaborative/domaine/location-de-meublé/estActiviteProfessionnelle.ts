import { Either, Option, pipe } from 'effect'

import { estPlusGrandOuÉgalÀ, eurosParAn } from '@/domaine/Montant'

import { AffiliationObligatoire } from './erreurs'
import { SituationÉconomieCollaborativeValide, TypeLocation } from './situation'

export const SEUIL_PROFESSIONNALISATION = {
	MEUBLÉ: eurosParAn(23_000),
	CHAMBRE_HÔTE: eurosParAn(6_028),
} as const

/**
 * Détermine si l'activité est considérée comme professionnelle selon les recettes
 * @param situation La situation avec des recettes
 * @returns true si les recettes sont supérieures ou égales au seuil de professionnalisation
 */
export function estActiviteProfessionnelle(
	situation: SituationÉconomieCollaborativeValide
): boolean {
	const typeLocation = Option.getOrElse(
		situation.typeLocation,
		(): TypeLocation => 'non-classé'
	)

	const seuil =
		typeLocation === 'chambre-hôte'
			? SEUIL_PROFESSIONNALISATION.CHAMBRE_HÔTE
			: SEUIL_PROFESSIONNALISATION.MEUBLÉ

	return pipe(situation.recettes.value, estPlusGrandOuÉgalÀ(seuil))
}

/**
 * Vérifie que l'activité n'est pas professionnelle
 * @param situation La situation avec des recettes
 * @returns Right(situation) si l'activité n'est pas professionnelle, Left(AffiliationObligatoire) sinon
 */
export function vérifieActivitéNonProfessionnelle(
	situation: SituationÉconomieCollaborativeValide
): Either.Either<SituationÉconomieCollaborativeValide, AffiliationObligatoire> {
	if (estActiviteProfessionnelle(situation)) {
		const typeLocation = Option.getOrElse(
			situation.typeLocation,
			(): TypeLocation => 'non-classé'
		)

		const seuil =
			typeLocation === 'chambre-hôte'
				? SEUIL_PROFESSIONNALISATION.CHAMBRE_HÔTE
				: SEUIL_PROFESSIONNALISATION.MEUBLÉ

		return Either.left(
			new AffiliationObligatoire({
				recettes: situation.recettes.value,
				seuil,
			})
		)
	}

	return Either.right(situation)
}
