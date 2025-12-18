import { Either, Option, pipe } from 'effect'

import { evalueAvecPublicodes } from '@/domaine/engine/engineSingleton'
import {
	estPlusGrandOuÉgalÀ,
	estPlusGrandQue,
	eurosParAn,
	Montant,
} from '@/domaine/Montant'
import {
	AutoEntrepreneurChiffreAffaireDansPublicodes,
	AutoEntrepreneurContexteDansPublicodes,
	AutoEntrepreneurCotisationsEtContributionsDansPublicodes,
} from '@/domaine/publicodes/AutoEntrepreneurContexteDansPublicodes'

import { EstApplicable } from './applicabilité'
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
	aRenseignéSesAutresRevenus,
	aRenseignéSonClassement,
	aRenseignéSonTypeDeDurée,
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
	const applicabilité = estApplicableMicroEntreprise(situation)
	if (Either.isRight(applicabilité) && !applicabilité.right) {
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

export const estApplicableMicroEntreprise: EstApplicable = (situation) => {
	if (!estActiviteProfessionnelle(situation)) {
		return Either.right(false)
	}

	if (situation.typeHébergement === 'chambre-hôte') {
		return Either.right(true)
	}

	if (!aRenseignéSesAutresRevenus(situation)) {
		return Either.left(['autresRevenus'])
	}

	if (!aRenseignéSonTypeDeDurée(situation)) {
		return Either.left(['typeDurée'])
	}
	const typeDurée = situation.typeDurée.value

	if (typeDurée === 'longue') {
		if (!estActivitéPrincipale(situation)) {
			return Either.right(false)
		}

		return Either.right(true)
	}

	if (
		!estActivitéPrincipale(situation) &&
		faitDeLaLocationCourteEtLongueDurée(situation)
	) {
		if (Option.isNone(situation.recettesCourteDurée)) {
			return Either.left(['recettesCourteDurée'])
		}
		const recettesCourteDurée = situation.recettesCourteDurée.value
		if (
			!pipe(
				recettesCourteDurée,
				estPlusGrandOuÉgalÀ(SEUIL_PROFESSIONNALISATION.MEUBLÉ)
			)
		) {
			return Either.right(false)
		}
	}

	if (!aRenseignéSonClassement(situation)) {
		return Either.left(['classement'])
	}
	const classement = situation.classement.value

	if (!estActivitéPrincipale(situation)) {
		if (faitDeLaLocationCourteEtLongueDurée(situation)) {
			if (classement !== 'classé') {
				return Either.right(false)
			}
		} else if (classement !== 'classé') {
			return Either.right(false)
		}
	}

	if (classement !== 'classé') {
		return Either.right(false)
	}

	return Either.right(true)
}
