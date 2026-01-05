import { Either } from 'effect'

import {
	compareApplicabilitéDesRégimes,
	RésultatApplicabilitéParRégime,
} from './comparateur-régimes'
import { SituationÉconomieCollaborativeValide } from './situation'

export const auMoinsUnRégimePotentiellementApplicable = (
	situation: SituationÉconomieCollaborativeValide
): boolean => {
	const résultats = compareApplicabilitéDesRégimes(situation)

	return résultats.some((résultat: RésultatApplicabilitéParRégime) => {
		const estApplicable =
			Either.isRight(résultat.résultat) && résultat.résultat.right.applicable
		const estSousConditions = Either.isLeft(résultat.résultat)

		return estApplicable || estSousConditions
	})
}
