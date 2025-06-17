/* eslint-disable no-unused-expressions */
/* eslint-disable vitest/valid-expect */
import * as O from 'effect/Option'
import { describe, expect, it } from 'vitest'

import { enfantOuvreDroitAuCMG, EnfantValide } from './enfant'

describe('CMG', () => {
	describe('enfantOuvreDroitAuCMG', () => {
		it('n’ouvre pas droit si né⋅e en 2022', () => {
			const résultat = enfantOuvreDroitAuCMG({
				prénom: O.some('Riri'),
				dateDeNaissance: O.some(new Date('2022-12-31')),
			} as EnfantValide)

			expect(résultat).to.be.false
		})
		it('n’ouvre pas droit si plus de 6 ans au 01/09/2025', () => {
			const résultat = enfantOuvreDroitAuCMG({
				prénom: O.some('Fifi'),
				dateDeNaissance: O.some(new Date('2019-09-01')),
			} as EnfantValide)

			expect(résultat).to.be.false
		})

		it('ouvre droit si moins de 6 ans au 01/09/2025 et pas né⋅e en 2022', () => {
			const résultat = enfantOuvreDroitAuCMG({
				prénom: O.some('Loulou'),
				dateDeNaissance: O.some(new Date('2019-09-02')),
			} as EnfantValide)

			expect(résultat).to.be.true
		})
	})
})
