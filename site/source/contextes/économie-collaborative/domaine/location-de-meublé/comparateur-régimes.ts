import { Array, Either, pipe } from 'effect'

import { Montant } from '@/domaine/Montant'

import { RégimeInapplicable } from './erreurs'
import { calculeCotisationsRégimeGénéral } from './régime-général'
import { calculeCotisationsMicroEntreprise } from './régime-micro-entreprise'
import { calculeCotisationsTravailleurIndépendant } from './régime-travailleur-indépendant'
import {
	RegimeCotisation,
	SituationÉconomieCollaborativeValide,
} from './situation'

export type RésultatRégimeApplicable = {
	régime: RegimeCotisation
	applicable: true
	cotisations: Montant<'€/an'>
}

export type RésultatRégimeNonApplicable = {
	régime: RegimeCotisation
	applicable: false
	raisonDeNonApplicabilité: RégimeInapplicable
}

type RésultatRégime = RésultatRégimeApplicable | RésultatRégimeNonApplicable

type CalculCotisations = (
	situation: SituationÉconomieCollaborativeValide
) => Either.Either<Montant<'€/an'>, RégimeInapplicable>

export const compareRégimes = (
	situation: SituationÉconomieCollaborativeValide
): RésultatRégime[] =>
	pipe(
		[
			{
				régime: RegimeCotisation.regimeGeneral,
				calcul: calculeCotisationsRégimeGénéral as CalculCotisations,
			},
			{
				régime: RegimeCotisation.microEntreprise,
				calcul: calculeCotisationsMicroEntreprise as CalculCotisations,
			},
			{
				régime: RegimeCotisation.travailleurIndependant,
				calcul: calculeCotisationsTravailleurIndépendant as CalculCotisations,
			},
		],
		Array.map(({ régime, calcul }) =>
			Either.match(calcul(situation), {
				onLeft: (erreur) =>
					({
						régime,
						applicable: false,
						raisonDeNonApplicabilité: erreur,
					}) as const,
				onRight: (cotisations) =>
					({
						régime,
						applicable: true,
						cotisations,
					}) as const,
			})
		)
	)
