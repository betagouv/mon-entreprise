import { Either, Option, pipe } from 'effect'

import { evalueAvecPublicodes } from '@/domaine/engine/engineSingleton'
import {
	estPlusGrandQue,
	estPlusPetitQue,
	eurosParAn,
	Montant,
} from '@/domaine/Montant'
import {
	AutoEntrepreneurChiffreAffaireDansPublicodes,
	AutoEntrepreneurContexteDansPublicodes,
	AutoEntrepreneurCotisationsEtContributionsDansPublicodes,
} from '@/domaine/publicodes/AutoEntrepreneurContexteDansPublicodes'

import {
	AffiliationNonObligatoire,
	AffiliationObligatoire,
	RecettesSupérieuresAuPlafondAutoriséPourCeRégime,
	RégimeNonApplicablePourCeTypeDeDurée,
	RégimeNonApplicablePourChambreDHôte,
} from './erreurs'
import { estActivitéPrincipale } from './estActivitéPrincipale'
import {
	estActiviteProfessionnelle,
	SEUIL_PROFESSIONNALISATION,
} from './estActiviteProfessionnelle'
import {
	faitDeLaLocationCourteDurée,
	faitDeLaLocationCourteEtLongueDurée,
	RegimeCotisation,
	SituationÉconomieCollaborativeValide,
	situationParDéfaut,
} from './situation'

export const PLAFOND_MICRO_ENTREPRISE_NON_CLASSE = eurosParAn(77_700)
export const PLAFOND_MICRO_ENTREPRISE_TOURISME_CLASSE = eurosParAn(188_700)
export const PLAFOND_MICRO_ENTREPRISE_CHAMBRE_HOTE = eurosParAn(188_700)

/**
 * Calcule les cotisations sociales pour le régime micro-entreprise
 * @param situation La situation avec des recettes
 * @returns Un Either contenant soit les cotisations calculées, soit une erreur
 */
export function calculeCotisationsMicroEntreprise(
	situation: SituationÉconomieCollaborativeValide
): Either.Either<
	Montant<'€/an'>,
	| AffiliationNonObligatoire
	| AffiliationObligatoire
	| RecettesSupérieuresAuPlafondAutoriséPourCeRégime
	| RégimeNonApplicablePourCeTypeDeDurée
	| RégimeNonApplicablePourChambreDHôte
> {
	if (!estActiviteProfessionnelle(situation)) {
		return Either.left(new AffiliationNonObligatoire())
	}

	if (situation.typeHébergement === 'chambre-hôte') {
		const revenuNet = situation.revenuNet.value

		if (
			pipe(revenuNet, estPlusGrandQue(PLAFOND_MICRO_ENTREPRISE_CHAMBRE_HOTE))
		) {
			return Either.left(
				new RecettesSupérieuresAuPlafondAutoriséPourCeRégime({
					recettes: revenuNet,
					plafond: PLAFOND_MICRO_ENTREPRISE_CHAMBRE_HOTE,
					régime: RegimeCotisation.microEntreprise,
				})
			)
		}

		const cotisations = evalueAvecPublicodes<number>(
			{
				...AutoEntrepreneurContexteDansPublicodes,
				...AutoEntrepreneurChiffreAffaireDansPublicodes.fromMontant(revenuNet),
			},
			AutoEntrepreneurCotisationsEtContributionsDansPublicodes.enEurosParAn
		)

		return Either.right(eurosParAn(cotisations))
	}

	const recettes = situation.recettes.value

	const classement = Option.getOrElse(
		situation.classement,
		() => situationParDéfaut.classement
	)

	const typeDurée = Option.getOrElse(
		situation.typeDurée,
		() => situationParDéfaut.typeDurée
	)

	if (!estActivitéPrincipale(situation)) {
		if (faitDeLaLocationCourteEtLongueDurée(situation)) {
			const recettesCourteDurée = pipe(
				situation.recettesCourteDurée,
				Option.getOrElse(() => eurosParAn(0))
			)
			if (
				pipe(
					recettesCourteDurée,
					estPlusPetitQue(SEUIL_PROFESSIONNALISATION.MEUBLÉ)
				) ||
				classement !== 'classé'
			) {
				return Either.left(new AffiliationNonObligatoire())
			}
		} else if (typeDurée !== 'courte' || classement !== 'classé') {
			return Either.left(new AffiliationNonObligatoire())
		}
	}

	if (
		estActivitéPrincipale(situation) &&
		faitDeLaLocationCourteDurée(situation) &&
		classement !== 'classé'
	) {
		return Either.left(
			new RégimeNonApplicablePourCeTypeDeDurée({
				typeDurée,
				régime: RegimeCotisation.microEntreprise,
				estActivitéPrincipale: true,
			})
		)
	}

	const plafond =
		classement === 'non-classé'
			? PLAFOND_MICRO_ENTREPRISE_NON_CLASSE
			: PLAFOND_MICRO_ENTREPRISE_TOURISME_CLASSE

	if (pipe(recettes, estPlusGrandQue(plafond))) {
		return Either.left(
			new RecettesSupérieuresAuPlafondAutoriséPourCeRégime({
				recettes,
				plafond,
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
