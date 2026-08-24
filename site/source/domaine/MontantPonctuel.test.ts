import { Equal } from 'effect'
import { describe, expect, it } from 'vitest'

import { euros, moins } from './MontantPonctuel'
import { eurosParMois } from './MontantRécurrent'

describe('MontantPonctuel', () => {
	it('soustrait deux montants de même unité', () => {
		expect(Equal.equals(moins(euros(100), euros(30)), euros(70))).toBe(true)
	})

	it('interdit à la compilation de soustraire un montant récurrent', () => {
		const vérificationsDeTypes = () => {
			// @ts-expect-error mélange d’unités interdit
			moins(euros(100), eurosParMois(10))
		}

		expect(vérificationsDeTypes).toBeDefined()
	})
})
