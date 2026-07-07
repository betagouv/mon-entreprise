import { Either, pipe } from 'effect'
import * as O from 'effect/Option'

import {
	estAffiliationObligatoire,
	estSituationValide,
	useEconomieCollaborative,
} from '@/contextes/economie-collaborative/index'

import { BlocAffiliationIndéterminée } from './BlocAffiliationIndeterminee'
import { BlocAffiliationNonObligatoire } from './BlocAffiliationNonObligatoire'
import { BlocAffiliationObligatoire } from './BlocAffiliationObligatoire'

export const AffichageSelonAffiliation = () => {
	const { situation } = useEconomieCollaborative()

	const résultat = pipe(
		situation,
		O.liftPredicate(estSituationValide),
		O.map(estAffiliationObligatoire)
	)

	if (O.isNone(résultat)) {
		return null
	}

	return Either.match(résultat.value, {
		onLeft: (réponsesManquantes) => (
			<BlocAffiliationIndéterminée réponsesManquantes={réponsesManquantes} />
		),
		onRight: (obligatoire) =>
			obligatoire ? (
				<BlocAffiliationObligatoire />
			) : (
				<BlocAffiliationNonObligatoire />
			),
	})
}
