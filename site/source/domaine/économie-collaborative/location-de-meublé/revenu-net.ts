import { Either, pipe } from 'effect'

import { calculeCotisations } from '@/domaine/économie-collaborative/location-de-meublé/cotisations'
import { SimulationImpossible } from '@/domaine/économie-collaborative/location-de-meublé/erreurs'
import { SituationLocationCourteDureeValide } from '@/domaine/économie-collaborative/location-de-meublé/situation'
import { EuroParAn, moins } from '@/domaine/Montant'

export const calculeRevenuNet = (
	situation: SituationLocationCourteDureeValide
): Either.Either<EuroParAn, SimulationImpossible> =>
	pipe(
		calculeCotisations(situation),
		Either.map((cotisations) =>
			pipe(situation.recettes.value, moins(cotisations))
		)
	)
