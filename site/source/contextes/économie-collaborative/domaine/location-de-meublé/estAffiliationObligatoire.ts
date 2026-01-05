import { Array, Either, pipe } from 'effect'

import { RéponseManquante } from './applicabilité'
import {
	compareApplicabilitéDesRégimes,
	RésultatApplicabilitéParRégime,
} from './comparateur-régimes'
import { SituationÉconomieCollaborativeValide } from './situation'

export const estAffiliationObligatoire = (
	situation: SituationÉconomieCollaborativeValide
): Either.Either<boolean, RéponseManquante[]> => {
	const résultats = compareApplicabilitéDesRégimes(situation)

	const auMoinsUnApplicable = résultats.some(
		(r: RésultatApplicabilitéParRégime) =>
			Either.isRight(r.résultat) && r.résultat.right.applicable
	)

	if (auMoinsUnApplicable) {
		return Either.right(true)
	}

	const aucunApplicable = résultats.every(
		(r: RésultatApplicabilitéParRégime) =>
			Either.isRight(r.résultat) && !r.résultat.right.applicable
	)

	if (aucunApplicable) {
		return Either.right(false)
	}

	return pipe(
		résultats,
		Array.flatMap((r: RésultatApplicabilitéParRégime) =>
			Either.isLeft(r.résultat) ? r.résultat.left : []
		),
		Array.dedupe,
		Either.left
	)
}
