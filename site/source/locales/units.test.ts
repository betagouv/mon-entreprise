import { describe, expect, it } from 'vitest'

import { getUnitKey } from './units'

describe('getUnitKey', () => {
	it('retrouve la clé de l’unité derrière son pluriel', () => {
		expect(getUnitKey('heures')).toBe('heure')
	})

	it('retrouve une clé en plusieurs mots', () => {
		expect(getUnitKey('jours ouvrés')).toBe('jour ouvré')
	})

	it('rend l’unité telle quelle quand elle n’est pas traduite', () => {
		expect(getUnitKey('€')).toBe('€')
	})
})
