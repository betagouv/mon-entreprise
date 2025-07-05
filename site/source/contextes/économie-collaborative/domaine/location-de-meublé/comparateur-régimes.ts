import { Array, Either, pipe } from 'effect'

import { RégimeInapplicable } from '@/contextes/économie-collaborative/domaine/location-de-meublé/erreurs'
import { Montant } from '@/domaine/Montant'

import { calculeCotisationsRégimeGénéral } from './régime-général'
import { calculeCotisationsMicroEntreprise } from './régime-micro-entreprise'
import { calculeCotisationsTravailleurIndépendant } from './régime-travailleur-indépendant'
import {
	RegimeCotisation,
	SituationÉconomieCollaborativeValide,
} from './situation'

type RésultatRégime =
	| {
			régime: RegimeCotisation
			applicable: true
			cotisations: Montant<'€/an'>
	  }
	| {
			régime: RegimeCotisation
			applicable: false
			raisonDeNonApplicabilité: RégimeInapplicable
	  }

export const compareRégimes = (
	situation: SituationÉconomieCollaborativeValide
): RésultatRégime[] =>
	pipe(
		[
			{
				régime: RegimeCotisation.regimeGeneral,
				calcul: calculeCotisationsRégimeGénéral,
			},
			{
				régime: RegimeCotisation.microEntreprise,
				calcul: calculeCotisationsMicroEntreprise,
			},
			{
				régime: RegimeCotisation.travailleurIndependant,
				calcul: calculeCotisationsTravailleurIndépendant,
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
