import { Either } from 'effect'

import {
	compareApplicabilitéDesRégimes,
	RésultatApplicabilité,
} from './comparateur-régimes'
import { SituationÉconomieCollaborativeValide } from './situation'

export const auMoinsUnRégimePotentiellementApplicable = (
	situation: SituationÉconomieCollaborativeValide
): boolean => {
	const résultats = compareApplicabilitéDesRégimes(situation)

	return résultats.some((résultat: RésultatApplicabilité) => {
		const estApplicable =
			Either.isRight(résultat.résultat) && résultat.résultat.right
		const estSousConditions = Either.isLeft(résultat.résultat)

		return estApplicable || estSousConditions
	})
}
