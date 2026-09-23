import { assert, describe, expect, it } from 'vitest'

import { getParamètresRéductionParMois } from './ParametresReduction'
import { annéeAvec, moteurZoneUn } from './test/fixtures'

const janvier = 0
const juin = 5

const paramètresDeLAnnée = () =>
	getParamètresRéductionParMois(
		annéeAvec([3500]),
		2025,
		moteurZoneUn('3500 €/an')
	)

describe('getParamètresRéductionParMois', () => {
	it('renseigne SMIC et coefficient T pour un mois rémunéré', () => {
		const paramètres = paramètresDeLAnnée()[janvier]

		assert(paramètres.moisRémunéré)

		expect(paramètres.rémunérationBrute).toBe(3500)
		expect(paramètres.SMIC).toBeCloseTo(1801.8, 2)
		expect(paramètres.coefT).toBe(0.3194)
	})

	it('écarte un mois sans rémunération, pour l’exclure du cumul', () => {
		expect(paramètresDeLAnnée()[juin].moisRémunéré).toBe(false)
	})

	it('rend un paramètre par mois de l’année', () => {
		expect(paramètresDeLAnnée()).toHaveLength(12)
	})
})
