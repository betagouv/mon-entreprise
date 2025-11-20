import { pipe } from 'effect'
import * as O from 'effect/Option'

import {
	estSituationValide,
	useEconomieCollaborative,
} from '@/contextes/économie-collaborative'
import { estActiviteProfessionnelle } from '@/contextes/économie-collaborative/domaine/location-de-meublé/estActiviteProfessionnelle'

import { BlocAffiliationNonObligatoire } from './BlocAffiliationNonObligatoire'
import { BlocAffiliationObligatoire } from './BlocAffiliationObligatoire'

export const AffichageSelonAffiliation = () => {
	const { situation } = useEconomieCollaborative()

	const affiliationObligatoire = pipe(
		situation,
		O.liftPredicate(estSituationValide),
		O.map(estActiviteProfessionnelle),
		O.getOrElse(() => false)
	)

	if (affiliationObligatoire) {
		return <BlocAffiliationObligatoire />
	}

	return <BlocAffiliationNonObligatoire />
}
