import { Array, Either, pipe } from 'effect'

import { Montant } from '@/domaine/Montant'

import { RéponseManquante, RésultatApplicabilité } from './applicabilité'
import { RégimeInapplicable } from './erreurs'
import {
	calculeCotisationsRégimeGénéral,
	estApplicableRégimeGénéral,
} from './régime-général'
import {
	calculeCotisationsMicroEntreprise,
	estApplicableMicroEntreprise,
} from './régime-micro-entreprise'
import {
	calculeCotisationsSécuritéSocialeDesIndépendants,
	estApplicableSécuritéSocialeDesIndépendants,
} from './régime-sécurité-sociale-indépendants'
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
				calcul:
					calculeCotisationsSécuritéSocialeDesIndépendants as CalculCotisations,
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

export type RésultatApplicabilitéParRégime = {
	régime: RegimeCotisation
	résultat: Either.Either<RésultatApplicabilité, RéponseManquante[]>
}

export const compareApplicabilitéDesRégimes = (
	situation: SituationÉconomieCollaborativeValide
): RésultatApplicabilitéParRégime[] =>
	pipe(
		[
			{
				régime: RegimeCotisation.regimeGeneral,
				estApplicable: estApplicableRégimeGénéral,
			},
			{
				régime: RegimeCotisation.microEntreprise,
				estApplicable: estApplicableMicroEntreprise,
			},
			{
				régime: RegimeCotisation.travailleurIndependant,
				estApplicable: estApplicableSécuritéSocialeDesIndépendants,
			},
		],
		Array.map(({ régime, estApplicable }) => ({
			régime,
			résultat: estApplicable(situation),
		}))
	)
