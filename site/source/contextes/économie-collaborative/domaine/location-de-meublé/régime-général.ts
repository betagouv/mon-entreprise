import { Either, Option, pipe } from 'effect'

import {
	abattement,
	estPlusGrandOuÉgalÀ,
	estPlusGrandQue,
	eurosParAn,
	fois,
	moins,
	Montant,
} from '@/domaine/Montant'

import {
	RecettesSupérieuresAuPlafondAutoriséPourCeRégime,
	RégimeNonApplicablePourCeTypeDeDurée,
	RégimeNonApplicablePourCeTypeDeLocation,
} from './erreurs'
import { estActivitéPrincipale } from './estActivitéPrincipale'
import { SEUIL_PROFESSIONNALISATION } from './estActiviteProfessionnelle'
import {
	RegimeCotisation,
	SituationÉconomieCollaborativeValide,
	situationParDéfaut,
} from './situation'

export const PLAFOND_REGIME_GENERAL = eurosParAn(77_700)
export const TAUX_COTISATION_RG_NORMAL = 0.4742
export const TAUX_COTISATION_RG_ALSACE_MOSELLE = 0.4872
export const ABATTEMENT_REGIME_GENERAL = 0.6

/**
 * Calcule les cotisations sociales pour le régime général
 * @param situation La situation avec des recettes
 * @returns Un Either contenant soit les cotisations calculées, soit une erreur
 */
export function calculeCotisationsRégimeGénéral(
	situation: SituationÉconomieCollaborativeValide
): Either.Either<
	Montant<'€/an'>,
	| RecettesSupérieuresAuPlafondAutoriséPourCeRégime
	| RégimeNonApplicablePourCeTypeDeLocation
	| RégimeNonApplicablePourCeTypeDeDurée
> {
	const recettes = situation.recettes.value

	const typeLocation = Option.getOrElse(
		situation.typeLocation,
		() => situationParDéfaut.typeLocation
	)

	if (typeLocation === 'chambre-hôte') {
		return Either.left(
			new RégimeNonApplicablePourCeTypeDeLocation({
				typeLocation,
				régime: RegimeCotisation.regimeGeneral,
			})
		)
	}

	if (pipe(recettes, estPlusGrandOuÉgalÀ(SEUIL_PROFESSIONNALISATION.MEUBLÉ))) {
		const typeDurée = Option.getOrElse(
			situation.typeDurée,
			() => situationParDéfaut.typeDurée
		)

		const estPrincipale = estActivitéPrincipale(situation)

		if (estPrincipale && typeDurée !== 'courte') {
			return Either.left(
				new RégimeNonApplicablePourCeTypeDeDurée({
					typeDurée,
					régime: RegimeCotisation.regimeGeneral,
					estActivitéPrincipale: estPrincipale,
				})
			)
		}
	}

	const estAlsaceMoselle = Option.getOrElse(
		situation.estAlsaceMoselle,
		() => situationParDéfaut.estAlsaceMoselle
	)

	const premièreAnnée = Option.getOrElse(
		situation.premièreAnnée,
		() => situationParDéfaut.premièreAnnée
	)

	// Vérification du plafond pour ce régime
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
		? pipe(recettes, estPlusGrandQue(SEUIL_PROFESSIONNALISATION.MEUBLÉ))
			? pipe(recettes, moins(SEUIL_PROFESSIONNALISATION.MEUBLÉ))
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
