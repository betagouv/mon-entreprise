import { Either } from 'effect'

import { evalueAvecPublicodes } from '@/domaine/engine/engineSingleton'
import { eurosParAn, Montant } from '@/domaine/Montant'
import {
	TravailleurIndependantChiffreAffaireDansPublicodes,
	TravailleurIndependantContexteDansPublicodes,
	TravailleurIndependantCotisationsEtContributionsDansPublicodes,
} from '@/domaine/publicodes/TravailleurIndependantContexteDansPublicodes'

import { SituationÉconomieCollaborativeValide } from './situation'

/**
 * Calcule les cotisations sociales pour le régime travailleur indépendant
 * Ce régime est toujours applicable, quel que soit le montant des recettes
 * C'est le régime "par défaut" quand les autres plafonds sont dépassés
 * @param situation La situation avec des recettes obligatoirement définies
 * @returns Toujours les cotisations calculées (jamais d'erreur)
 */
export function calculeCotisationsTravailleurIndépendant(
	situation: SituationÉconomieCollaborativeValide
): Either.Either<Montant<'€/an'>, never> {
	const recettes = situation.recettes.value

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
