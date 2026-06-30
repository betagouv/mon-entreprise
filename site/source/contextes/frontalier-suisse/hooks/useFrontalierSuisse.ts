import { Option } from 'effect'
import { useMemo } from 'react'

import { Montant } from '@/domaine/Montant'

import {
	annéeDeSimulation,
	annéeDesRevenus,
} from '../domaine/annee-de-simulation'
import {
	initialSituationFrontalierSuisse,
	SituationFrontalierSuisse,
} from '../domaine/situation'
import { useSituationContext } from './FrontalierSuisseContext'

export const useFrontalierSuisse = () => {
	const { situation, updateSituation } = useSituationContext()

	const annéeRevenus = Option.isSome(situation.dateAffiliation)
		? annéeDesRevenus(
				situation.dateAffiliation.value,
				Option.getOrUndefined(situation.dateFinAffiliation)
		  )
		: annéeDeSimulation()

	const set = useMemo(
		() => ({
			dateAffiliation: (dateAffiliation: Option.Option<Date>) => {
				updateSituation((prev) => ({ ...prev, dateAffiliation }))
			},

			dateFinAffiliation: (dateFinAffiliation: Option.Option<Date>) => {
				updateSituation((prev) => ({ ...prev, dateFinAffiliation }))
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
		}),
		[updateSituation]
	)

	return {
		situation,
		set,
		annéeRevenus,
	}
}
