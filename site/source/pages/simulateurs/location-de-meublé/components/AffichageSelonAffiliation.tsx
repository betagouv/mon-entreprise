import { pipe } from 'effect'
import * as O from 'effect/Option'

import {
	auMoinsUnRégimePotentiellementApplicable,
	estSituationValide,
	useEconomieCollaborative,
} from '@/contextes/économie-collaborative'

import { BlocAffiliationNonObligatoire } from './BlocAffiliationNonObligatoire'
import { BlocAffiliationObligatoire } from './BlocAffiliationObligatoire'

export const AffichageSelonAffiliation = () => {
	const { situation } = useEconomieCollaborative()

	const affiliationObligatoire = pipe(
		situation,
		O.liftPredicate(estSituationValide),
		O.map(auMoinsUnRégimePotentiellementApplicable),
		O.getOrElse(() => false)
	)

	if (affiliationObligatoire) {
		return <BlocAffiliationObligatoire />
	}

	return <BlocAffiliationNonObligatoire />
}
