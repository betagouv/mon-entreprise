import { Array, Either, pipe } from 'effect'

import { RégimeInapplicable } from '@/domaine/économie-collaborative/location-de-meublé/erreurs'
import { EuroParAn } from '@/domaine/Montant'

import { calculeCotisationsRégimeGénéral } from './régime-général'
import { calculeCotisationsMicroEntreprise } from './régime-micro-entreprise'
import { calculeCotisationsTravailleurIndépendant } from './régime-travailleur-indépendant'
import {
	RegimeCotisation,
	SituationLocationCourteDureeValide,
} from './situation'

type RésultatRégime =
	| {
			régime: RegimeCotisation
			applicable: true
			cotisations: EuroParAn
	  }
	| {
			régime: RegimeCotisation
			applicable: false
			raisonDeNonApplicabilité: RégimeInapplicable
	  }

export const compareRégimes = (
	situation: SituationLocationCourteDureeValide
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
