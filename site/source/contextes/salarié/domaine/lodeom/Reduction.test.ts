import { describe, expect, it } from 'vitest'

import { getParamètresRéductionParMois } from './ParametresReduction'
import { getMonthlyRéduction, getTotalRéduction } from './Reduction'
import { annéeAvec, moteurZoneUn, sansOptions } from './test/fixtures'

const janvier = 0

describe('getMonthlyRéduction', () => {
	it('calcule l’exonération du mois pour une rémunération donnée', () => {
		expect(
			getMonthlyRéduction(
				2025,
				janvier,
				3500,
				sansOptions,
				moteurZoneUn('3500 €/an')
			)
		).toBeCloseTo(214.2, 2)
	})

	it('fait varier l’exonération avec les heures supplémentaires', () => {
		const moteur = moteurZoneUn('3500 €/an')
		const avecHeuresSup = getMonthlyRéduction(
			2025,
			janvier,
			3500,
			{ ...sansOptions, heuresSupplémentaires: 5 },
			moteur
		)

		expect(avecHeuresSup).not.toBeCloseTo(
			getMonthlyRéduction(2025, janvier, 3500, sansOptions, moteur),
			2
		)
	})
})

describe('getTotalRéduction', () => {
	const moteur = moteurZoneUn('7000 €/an')
	const paramètresPourLesRémunérations = (rémunérations: number[]) =>
		getParamètresRéductionParMois(annéeAvec(rémunérations), 2025, moteur)

	it('cumule la réduction sur les mois rémunérés', () => {
		expect(
			getTotalRéduction(paramètresPourLesRémunérations([3500, 3500]), moteur)
		).toBeCloseTo(428.4, 2)
	})

	it('ignore les mois sans rémunération', () => {
		expect(
			getTotalRéduction(paramètresPourLesRémunérations([3500]), moteur)
		).toBeCloseTo(214.2, 2)
	})
})
