import { describe, expect, it } from 'vitest'

import { getDateForContexte } from './publicodes'

describe('getDateForContexte', () => {
	it('rend le premier jour de l’année au format attendu par Publicodes', () => {
		expect(getDateForContexte(2025)).toBe('01/01/2025')
	})

	it('rend le premier jour du mois demandé', () => {
		expect(getDateForContexte(2025, 11)).toBe('01/12/2025')
	})
})
