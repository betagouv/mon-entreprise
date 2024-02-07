import { describe, expect, it } from 'vitest'

import { getSiegeOrFirstEtablissement } from '@/api/fabrique-social'

import {
	fabriqueSocialWithoutSiege,
	fabriqueSocialWithSiege,
} from './fabrique-social.fixtures'

describe('Fabrique Social', () => {
	describe('getSiegeOrFirstEtablissement Function', () => {
		it('should return siege', () => {
			const siege = getSiegeOrFirstEtablissement(fabriqueSocialWithSiege)
			expect(siege.address).to.equal('23 RUE DE MOGADOR 75009 PARIS 9')
		})
		it('should return FirstEtablissement', () => {
			const siege = getSiegeOrFirstEtablissement(fabriqueSocialWithoutSiege)
			expect(siege.address).to.equal('4 RUE VOLTAIRE 44000 NANTES')
		})
	})
})
