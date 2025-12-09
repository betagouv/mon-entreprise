import { Either, Option, pipe } from 'effect'

import { evalueAvecPublicodes } from '@/domaine/engine/engineSingleton'
import { estPlusGrandOuÉgalÀ, eurosParAn, Montant } from '@/domaine/Montant'
import {
	TravailleurIndependantChiffreAffaireDansPublicodes,
	TravailleurIndependantContexteDansPublicodes,
	TravailleurIndependantCotisationsEtContributionsDansPublicodes,
} from '@/domaine/publicodes/TravailleurIndependantContexteDansPublicodes'

import { EstApplicable } from './applicabilité'
import { AffiliationNonObligatoire } from './erreurs'
import { estActivitéPrincipale } from './estActivitéPrincipale'
import {
	estActiviteProfessionnelle,
	SEUIL_PROFESSIONNALISATION,
} from './estActiviteProfessionnelle'
import {
	aRenseignéSesAutresRevenus,
	faitDeLaLocationCourteEtLongueDurée,
	SituationÉconomieCollaborativeValide,
} from './situation'

export const estApplicableTravailleurIndépendant: EstApplicable = (
	situation
) => {
	if (!estActiviteProfessionnelle(situation)) {
		return Either.right(false)
	}

	if (situation.typeHébergement === 'chambre-hôte') {
		return Either.right(true)
	}

	if (!aRenseignéSesAutresRevenus(situation)) {
		return Either.left(['autresRevenus'])
	}

	if (!estActivitéPrincipale(situation)) {
		if (Option.isNone(situation.typeDurée)) {
			return Either.left(['typeDurée'])
		}

		if (faitDeLaLocationCourteEtLongueDurée(situation)) {
			const recettesCourteDurée = pipe(
				situation.recettesCourteDurée,
				Option.getOrElse(() => eurosParAn(0))
			)
			if (
				!pipe(
					recettesCourteDurée,
					estPlusGrandOuÉgalÀ(SEUIL_PROFESSIONNALISATION.MEUBLÉ)
				)
			) {
				return Either.right(false)
			}
		} else if (situation.typeDurée.value !== 'courte') {
			return Either.right(false)
		}
	}

	return Either.right(true)
}

/**
 * Calcule les cotisations sociales pour le régime travailleur indépendant
 * Ce régime est toujours applicable, quel que soit le montant des recettes/revenu net,
 * sauf en cas d'activité secondaire où l'affiliation n'est pas obligatoire
 * C'est le régime "par défaut" quand les autres plafonds sont dépassés
 * @param situation La situation avec des recettes ou revenu net obligatoirement définis
 * @returns Un Either contenant soit les cotisations calculées, soit une erreur
 */
export function calculeCotisationsTravailleurIndépendant(
	situation: SituationÉconomieCollaborativeValide
): Either.Either<Montant<'€/an'>, AffiliationNonObligatoire> {
	const applicabilité = estApplicableTravailleurIndépendant(situation)
	if (Either.isRight(applicabilité) && !applicabilité.right) {
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
