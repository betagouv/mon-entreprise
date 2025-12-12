import { Either, Option, pipe } from 'effect'

import { evalueAvecPublicodes } from '@/domaine/engine/engineSingleton'
import { estPlusPetitQue, eurosParAn, Montant } from '@/domaine/Montant'
import {
	TravailleurIndependantChiffreAffaireDansPublicodes,
	TravailleurIndependantContexteDansPublicodes,
	TravailleurIndependantCotisationsEtContributionsDansPublicodes,
} from '@/domaine/publicodes/TravailleurIndependantContexteDansPublicodes'

import { AffiliationNonObligatoire } from './erreurs'
import { estActivitéPrincipale } from './estActivitéPrincipale'
import {
	estActiviteProfessionnelle,
	SEUIL_PROFESSIONNALISATION,
} from './estActiviteProfessionnelle'
import {
	faitDeLaLocationCourteEtLongueDurée,
	SituationÉconomieCollaborativeValide,
	situationParDéfaut,
} from './situation'

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
	if (!estActiviteProfessionnelle(situation)) {
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
				)
			) {
				return Either.left(new AffiliationNonObligatoire())
			}
		} else {
			const typeDurée = Option.getOrElse(
				situation.typeDurée,
				() => situationParDéfaut.typeDurée
			)
			if (typeDurée !== 'courte') {
				return Either.left(new AffiliationNonObligatoire())
			}
		}
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
