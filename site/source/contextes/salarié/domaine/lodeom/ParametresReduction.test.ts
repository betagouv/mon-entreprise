import * as O from 'effect/Option'
import { describe, expect, it } from 'vitest'

import { getParamètresRéductionParMois } from './ParametresReduction'
import { annéeAvec, moteurZoneUn } from './test/fixtures'

const janvier = 0
const juin = 5

const annéeAvecRémunérationEnJanvier = annéeAvec([3500])

describe('getParamètresRéductionParMois', () => {
	it('renseigne SMIC et coefficient T pour un mois rémunéré', () => {
		const paramètres = getParamètresRéductionParMois(
			annéeAvecRémunérationEnJanvier,
			2025,
			moteurZoneUn('3500 €/an')
		)

		expect(paramètres[janvier].rémunérationBrute).toBe(3500)
		expect(O.getOrNull(paramètres[janvier].SMIC)).toBeCloseTo(1801.8, 2)
		expect(O.getOrNull(paramètres[janvier].coefT)).toBe(0.3194)
	})

	it('laisse SMIC et coefficient T vides pour un mois sans rémunération, afin de les exclure du cumul', () => {
		const paramètres = getParamètresRéductionParMois(
			annéeAvecRémunérationEnJanvier,
			2025,
			moteurZoneUn('3500 €/an')
		)

		expect(paramètres[juin].rémunérationBrute).toBe(0)
		expect(O.isNone(paramètres[juin].SMIC)).toBe(true)
		expect(O.isNone(paramètres[juin].coefT)).toBe(true)
	})

	it('rend un paramètre par mois de l’année', () => {
		expect(
			getParamètresRéductionParMois(
				annéeAvecRémunérationEnJanvier,
				2025,
				moteurZoneUn('3500 €/an')
			)
		).toHaveLength(12)
	})
})
