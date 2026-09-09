import { Either, pipe } from 'effect'

import { calculeCotisations } from '@/contextes/économie-collaborative/domaine/location-de-meublé/cotisations'
import { SimulationImpossible } from '@/contextes/économie-collaborative/domaine/location-de-meublé/erreurs'
import { SituationÉconomieCollaborativeValide } from '@/contextes/économie-collaborative/domaine/location-de-meublé/situation'
import { moins, Montant } from '@/domaine/Montant'

export const calculeRevenuNet = (
	situation: SituationÉconomieCollaborativeValide
): Either.Either<Montant<'€/an'>, SimulationImpossible> =>
	pipe(
		calculeCotisations(situation),
		Either.map((cotisations) =>
			pipe(situation.recettes.value, moins(cotisations))
		)
	)
