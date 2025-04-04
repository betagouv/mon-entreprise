import { Either, pipe } from 'effect'

import { calculeCotisations } from '@/domaine/économie-collaborative/location-de-meublé/cotisations'
import { RégimeInapplicable } from '@/domaine/économie-collaborative/location-de-meublé/erreurs'
import { SituationLocationCourteDuree } from '@/domaine/économie-collaborative/location-de-meublé/situation'
import { EuroParAn, moins } from '@/domaine/Montant'

/**
 * Calcule le revenu net après cotisations sociales
 * @param situation La situation avec un régime de cotisation optionnel
 * @returns Un Either contenant soit le revenu net calculé, soit l'erreur qui a empêché le calcul des cotisations
 */
export function calculeRevenuNet(
	situation: SituationLocationCourteDuree
): Either.Either<EuroParAn, RégimeInapplicable> {
	const recettes = situation.recettes

	return pipe(
		calculeCotisations(situation),
		Either.map((cotisations) => pipe(recettes, moins(cotisations)))
	)
}
