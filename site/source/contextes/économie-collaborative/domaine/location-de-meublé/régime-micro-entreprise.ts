import { Either, Option, pipe } from 'effect'

import { evalueAvecPublicodes } from '@/domaine/engine/engineSingleton'
import { estPlusGrandQue, eurosParAn, Montant } from '@/domaine/Montant'
import {
	AutoEntrepreneurChiffreAffaireDansPublicodes,
	AutoEntrepreneurContexteDansPublicodes,
	AutoEntrepreneurCotisationsEtContributionsDansPublicodes,
} from '@/domaine/publicodes/AutoEntrepreneurContexteDansPublicodes'

import {
	RecettesSupérieuresAuPlafondAutoriséPourCeRégime,
	RégimeNonApplicablePourCeTypeDeDurée,
	RégimeNonApplicablePourChambreDHôte,
} from './erreurs'
import { estActivitéPrincipale } from './estActivitéPrincipale'
import { estActiviteProfessionnelle } from './estActiviteProfessionnelle'
import {
	RegimeCotisation,
	SituationÉconomieCollaborativeValide,
	TypeTourisme,
} from './situation'

export const PLAFOND_MICRO_ENTREPRISE_NON_CLASSE = eurosParAn(77_700)
export const PLAFOND_MICRO_ENTREPRISE_TOURISME_CLASSE = eurosParAn(188_700)

/**
 * Calcule les cotisations sociales pour le régime micro-entreprise
 * @param situation La situation avec des recettes
 * @returns Un Either contenant soit les cotisations calculées, soit une erreur
 */
export function calculeCotisationsMicroEntreprise(
	situation: SituationÉconomieCollaborativeValide
): Either.Either<
	Montant<'€/an'>,
	| RecettesSupérieuresAuPlafondAutoriséPourCeRégime
	| RégimeNonApplicablePourCeTypeDeDurée
	| RégimeNonApplicablePourChambreDHôte
> {
	if (situation._subtype === 'chambre-hôte') {
		return Either.left(
			new RégimeNonApplicablePourChambreDHôte({
				régime: RegimeCotisation.microEntreprise,
			})
		)
	}

	const recettes = situation.recettes.value

	const typeTourisme = Option.getOrElse(
		situation.typeTourisme,
		(): TypeTourisme => 'tourisme-non-classé'
	)

	const typeDurée = Option.getOrUndefined(situation.typeDurée)

	if (
		estActiviteProfessionnelle(situation) &&
		estActivitéPrincipale(situation) &&
		typeDurée === 'courte' &&
		typeTourisme === 'tourisme-non-classé'
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
		typeTourisme === 'tourisme-non-classé'
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
