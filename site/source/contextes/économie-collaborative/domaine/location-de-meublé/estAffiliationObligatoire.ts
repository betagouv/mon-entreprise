import { Array, Either, pipe } from 'effect'

import {
	compareApplicabilitéDesRégimes,
	RésultatApplicabilité,
} from './comparateur-régimes'
import { RéponseManquante } from './erreurs'
import { SituationÉconomieCollaborativeValide } from './situation'

export const estAffiliationObligatoire = (
	situation: SituationÉconomieCollaborativeValide
): Either.Either<boolean, RéponseManquante[]> => {
	const résultats = compareApplicabilitéDesRégimes(situation)

	const auMoinsUnApplicable = résultats.some(
		(r: RésultatApplicabilité) => Either.isRight(r.résultat) && r.résultat.right
	)

	if (auMoinsUnApplicable) {
		return Either.right(true)
	}

	const aucunApplicable = résultats.every(
		(r: RésultatApplicabilité) =>
			Either.isRight(r.résultat) && !r.résultat.right
	)

	if (aucunApplicable) {
		return Either.right(false)
	}

	return pipe(
		résultats,
		Array.flatMap((r: RésultatApplicabilité) =>
			Either.isLeft(r.résultat) ? r.résultat.left : []
		),
		Array.dedupe,
		Either.left
	)
}
