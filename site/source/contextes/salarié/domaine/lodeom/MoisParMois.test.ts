import { describe, expect, it } from 'vitest'

import {
	initialRéductionMoisParMois,
	rémunérationBruteAnnuelle,
} from './MoisParMois'

describe('initialRéductionMoisParMois', () => {
	it('couvre les douze mois de l’année', () => {
		expect(initialRéductionMoisParMois).toHaveLength(12)
	})

	it('part d’une année vierge : ni rémunération, ni réduction, ni régularisation', () => {
		initialRéductionMoisParMois.forEach((mois) => {
			expect(mois.rémunérationBrute).toBe(0)
			expect(mois.réduction.value).toBe(0)
			expect(mois.régularisation.value).toBe(0)
			expect(mois.options).toStrictEqual({
				heuresSupplémentaires: 0,
				heuresComplémentaires: 0,
				rémunérationETP: 0,
				rémunérationPrimes: 0,
			})
		})
	})
})

describe('rémunérationBruteAnnuelle', () => {
	it('vaut zéro sur une année vierge', () => {
		expect(rémunérationBruteAnnuelle(initialRéductionMoisParMois)).toBe(0)
	})

	it('additionne les rémunérations des douze mois', () => {
		const données = initialRéductionMoisParMois.map((mois, index) => ({
			...mois,
			rémunérationBrute: (index + 1) * 100,
		}))

		expect(rémunérationBruteAnnuelle(données)).toBe(7800)
	})
})
