import { Option } from 'effect'

import { Montant } from '@/domaine/Montant'

import {
	initialSituationFrontalierSuisse,
	SituationFrontalierSuisse,
} from '../domaine/situation'
import { useSituationContext } from './FrontalierSuisseContext'

export const useFrontalierSuisse = () => {
	const { situation, updateSituation } = useSituationContext()

	const set = {
		dateAffiliation: (dateAffiliation: Option.Option<Date>) => {
			updateSituation((prev) => ({ ...prev, dateAffiliation }))
		},

		salaires: (salaires: Option.Option<Montant<'€/an'>>) => {
			updateSituation((prev) => ({ ...prev, salaires }))
		},

		autresRevenus: (autresRevenus: Option.Option<Montant<'€/an'>>) => {
			updateSituation((prev) => ({ ...prev, autresRevenus }))
		},

		situation: (situation: SituationFrontalierSuisse) => {
			updateSituation(() => situation)
		},

		reset: () => {
			updateSituation(() => initialSituationFrontalierSuisse)
		},
	}

	return {
		situation,
		set,
	}
}
