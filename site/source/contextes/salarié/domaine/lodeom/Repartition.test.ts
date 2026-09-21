import { describe, expect, it } from 'vitest'

import { getRépartition } from './Repartition'
import { moteurZoneUn } from './test/fixtures'

describe('getRépartition', () => {
	const exonération = 214.2

	it('ventile l’exonération entre retraite complémentaire et sécurité sociale', () => {
		const { IRC, Urssaf } = getRépartition(
			3500,
			exonération,
			moteurZoneUn('3500 €/an')
		)

		expect(IRC).toBeGreaterThan(0)
		expect(Urssaf).toBeGreaterThan(IRC)
		expect(IRC + Urssaf).toBeCloseTo(exonération, 2)
	})

	it('impute au chômage une part de la sécurité sociale', () => {
		const { Urssaf, chômage } = getRépartition(
			3500,
			exonération,
			moteurZoneUn('3500 €/an')
		)

		expect(chômage).toBeGreaterThan(0)
		expect(chômage).toBeLessThan(Urssaf)
	})
})
