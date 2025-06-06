import { pipe } from 'effect'
import * as O from 'effect/Option'
import * as R from 'effect/Record'

import { euros, Montant } from '@/domaine/Montant'

import { calculeComplémentTransitoire } from '../domaine/calcul'
import { éligibilité } from '../domaine/éligibilité'
import { Enfant } from '../domaine/enfant'
import { SalariéeAMA, SalariéeGED } from '../domaine/salariée'
import {
	estSituationCMGValide,
	initialSituationCMG,
	SituationCMG,
	SituationCMGValide,
} from '../domaine/situation'
import { useSituationContext } from './CMGContext'

export const useCMG = () => {
	const { situation, updateSituation } = useSituationContext()

	const éligible = estSituationCMGValide(situation)
		? éligibilité(situation).estÉligible
		: false

	const montantCT = éligible
		? calculeComplémentTransitoire(situation as SituationCMGValide)
		: euros(0)

	const set = {
		situation: (situation: SituationCMG) => {
			updateSituation(() => situation)
		},

		reset: () => {
			updateSituation(() => initialSituationCMG)
		},

		parentIsolé: (parentIsolé: O.Option<boolean>) => {
			updateSituation((prev) => ({ ...prev, parentIsolé }))
		},

		ressources: (ressources: O.Option<Montant<'EuroParAn'>>) => {
			updateSituation((prev) => ({ ...prev, ressources }))
		},

		aPerçuCMG: (aPerçuCMG: O.Option<boolean>) => {
			updateSituation((prev) => ({ ...prev, aPerçuCMG }))
		},

		plusDe2MoisDeDéclaration: (plusDe2MoisDeDéclaration: O.Option<boolean>) => {
			updateSituation((prev) => ({ ...prev, plusDe2MoisDeDéclaration }))
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

		perçoitAeeH: (perçoitAeeH: O.Option<boolean>) => {
			updateSituation((prev) => ({
				...prev,
				enfantsÀCharge: {
					...prev.enfantsÀCharge,
					perçoitAeeH,
				},
			}))
		},

		AeeH: (AeeH: O.Option<number>) => {
			updateSituation((prev) => ({
				...prev,
				enfantsÀCharge: {
					...prev.enfantsÀCharge,
					AeeH,
				},
			}))
		},

		salariéesGED: (salariéesGED: Array<SalariéeGED>) => {
			updateSituation((prev) => ({
				...prev,
				modesDeGarde: {
					AMA: prev.modesDeGarde.AMA,
					GED: salariéesGED,
				},
			}))
		},

		nouvelleGED: () => {
			updateSituation((prev) => ({
				...prev,
				modesDeGarde: {
					AMA: prev.modesDeGarde.AMA,
					GED: [
						...prev.modesDeGarde.GED,
						{
							mars: O.none(),
							avril: O.none(),
							mai: O.none(),
						},
					],
				},
			}))
		},

		salariéesAMA: (salariéesAMA: Array<SalariéeAMA<string>>) => {
			updateSituation((prev) => ({
				...prev,
				modesDeGarde: {
					GED: prev.modesDeGarde.GED,
					AMA: salariéesAMA,
				},
			}))
		},

		nouvelleAMA: () => {
			updateSituation((prev) => ({
				...prev,
				modesDeGarde: {
					GED: prev.modesDeGarde.GED,
					AMA: [
						...prev.modesDeGarde.AMA,
						{
							mars: O.none(),
							avril: O.none(),
							mai: O.none(),
						},
					],
				},
			}))
		},
	}

	return {
		situation,
		enfants: R.values(situation.enfantsÀCharge.enfants),
		perçoitAeeH: situation.enfantsÀCharge.perçoitAeeH,
		AeeH: situation.enfantsÀCharge.AeeH,
		salariéesGED: situation.modesDeGarde.GED,
		salariéesAMA: situation.modesDeGarde.AMA,
		éligible,
		montantCT,
		set,
	}
}
