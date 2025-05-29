import { pipe } from 'effect'
import * as O from 'effect/Option'
import * as R from 'effect/Record'

import { Montant } from '@/domaine/Montant'

import { Enfant } from '../domaine/enfant'
import { initialSituationCMG, SituationCMG } from '../domaine/situation'
import { useSituationContext } from './CMGContext'

export const useCMG = () => {
	const { situation, updateSituation } = useSituationContext()

	const set = {
		situation: (situation: SituationCMG) => {
			updateSituation(() => situation)
		},

		reset: () => {
			updateSituation(() => initialSituationCMG)
		},

		ressources: (ressources: O.Option<Montant<'EuroParAn'>>) => {
			updateSituation((prev) => ({ ...prev, ressources }))
		},

		enfants: (enfants: Array<Enfant>) => {
			const nouveauxEnfants = pipe(
				enfants,
				R.fromIterableWith((e) => [O.getOrElse(e.prénom, () => ''), e])
			)
			updateSituation((prev) => ({
				...prev,
				enfantsÀCharge: {
					...prev.enfantsÀCharge,
					enfants: nouveauxEnfants,
				},
			}))
		},

		nouvelEnfant: () => {
			updateSituation((prev) => ({
				...prev,
				enfantsÀCharge: {
					...prev.enfantsÀCharge,
					enfants: {
						...prev.enfantsÀCharge.enfants,
						'': {
							prénom: O.none(),
							dateDeNaissance: O.none(),
						},
					},
				},
			}))
		},
	}

	return {
		situation,
		enfants: R.values(situation.enfantsÀCharge.enfants),
		set,
	}
}
