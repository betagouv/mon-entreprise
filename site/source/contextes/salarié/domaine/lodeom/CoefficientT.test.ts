import { describe, expect, it } from 'vitest'

import { getCoefT } from './CoefficientT'
import { moteurZoneUn } from './test/fixtures'

describe('getCoefT', () => {
	const janvier = 0
	const décembre = 11

	it('transmet le mois au moteur', () => {
		const moteur = moteurZoneUn('3500 €/an')

		expect(getCoefT(2025, janvier, 3500, moteur)).toBe(0.3194)
		expect(getCoefT(2025, décembre, 3500, moteur)).toBe(0.3193)
	})

	it('se calcule même quand la situation du moteur ne porte pas encore de rémunération', () => {
		expect(getCoefT(2025, janvier, 3500, moteurZoneUn())).toBe(0.3194)
	})
})
