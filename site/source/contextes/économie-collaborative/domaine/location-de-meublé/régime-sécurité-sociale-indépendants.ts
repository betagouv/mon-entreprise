import { Either, Option, pipe } from 'effect'

import { evalueAvecPublicodes } from '@/domaine/engine/engineSingleton'
import { estPlusGrandOuÉgalÀ, eurosParAn, Montant } from '@/domaine/Montant'
import {
	TravailleurIndependantChiffreAffaireDansPublicodes,
	TravailleurIndependantContexteDansPublicodes,
	TravailleurIndependantCotisationsEtContributionsDansPublicodes,
} from '@/domaine/publicodes/TravailleurIndependantContexteDansPublicodes'

import {
	applicableSurRecettesCourteDurée,
	applicableSurToutesRecettes,
	EstApplicable,
	NON_APPLICABLE,
} from './applicabilité'
import { AffiliationNonObligatoire } from './erreurs'
import { estActivitéPrincipale } from './estActivitéPrincipale'
import {
	estActiviteProfessionnelle,
	SEUIL_PROFESSIONNALISATION,
} from './estActiviteProfessionnelle'
import {
	aRenseignéSesAutresRevenus,
	aRenseignéSonTypeDeDurée,
	faitDeLaLocationCourteEtLongueDurée,
	SituationÉconomieCollaborativeValide,
} from './situation'

export const estApplicableSécuritéSocialeDesIndépendants: EstApplicable = (
	situation
) => {
	if (!estActiviteProfessionnelle(situation)) {
		return NON_APPLICABLE
	}

	if (situation.typeHébergement === 'chambre-hôte') {
		return applicableSurToutesRecettes(situation.revenuNet.value)
	}

	const recettes = situation.recettes.value

	if (!aRenseignéSesAutresRevenus(situation)) {
		return Either.left(['autresRevenus'])
	}

	if (!estActivitéPrincipale(situation)) {
		if (!aRenseignéSonTypeDeDurée(situation)) {
			return Either.left(['typeDurée'])
		}

		if (faitDeLaLocationCourteEtLongueDurée(situation)) {
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
				return NON_APPLICABLE
			}

			return applicableSurRecettesCourteDurée(recettesCourteDurée)
		} else if (situation.typeDurée.value !== 'courte') {
			return NON_APPLICABLE
		}
	}

	return applicableSurToutesRecettes(recettes)
}

/**
 * Calcule les cotisations sociales pour le régime Sécurité Sociale des Indépendants
 * Ce régime est toujours applicable, quel que soit le montant des recettes/revenu net,
 * sauf en cas d'activité secondaire où l'affiliation n'est pas obligatoire
 * C'est le régime "par défaut" quand les autres plafonds sont dépassés
 * @param situation La situation avec des recettes ou revenu net obligatoirement définis
 * @returns Un Either contenant soit les cotisations calculées, soit une erreur
 */
export function calculeCotisationsSécuritéSocialeDesIndépendants(
	situation: SituationÉconomieCollaborativeValide
): Either.Either<Montant<'€/an'>, AffiliationNonObligatoire> {
	const applicabilité = estApplicableSécuritéSocialeDesIndépendants(situation)
	if (Either.isRight(applicabilité) && !applicabilité.right.applicable) {
		return Either.left(new AffiliationNonObligatoire())
	}

	if (situation.typeHébergement === 'chambre-hôte') {
		const revenuNet = situation.revenuNet.value

		const cotisations = evalueAvecPublicodes<number>(
			{
				...TravailleurIndependantContexteDansPublicodes,
				...TravailleurIndependantChiffreAffaireDansPublicodes.fromMontant(
					revenuNet
				),
			},
			TravailleurIndependantCotisationsEtContributionsDansPublicodes.enEurosParAn
		)

		return Either.right(eurosParAn(cotisations))
	}

	const cotisations = evalueAvecPublicodes<number>(
		{
			...TravailleurIndependantContexteDansPublicodes,
			...TravailleurIndependantChiffreAffaireDansPublicodes.fromMontant(
				situation.recettes.value
			),
		},
		TravailleurIndependantCotisationsEtContributionsDansPublicodes.enEurosParAn
	)

	return Either.right(eurosParAn(cotisations))
}
