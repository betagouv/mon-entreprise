import { describe, expect, it } from 'vitest'

import { parseDarkModeValue } from './darkModeStorage'

describe('parseDarkModeValue', () => {
	it('renvoie true uniquement pour la chaîne "true"', () => {
		expect(parseDarkModeValue('true')).toBe(true)
	})

	it('renvoie false pour la chaîne "false"', () => {
		expect(parseDarkModeValue('false')).toBe(false)
	})

	it('renvoie false quand le cookie est absent (undefined)', () => {
		expect(parseDarkModeValue(undefined)).toBe(false)
	})

	it('renvoie false quand localStorage est vide (null)', () => {
		expect(parseDarkModeValue(null)).toBe(false)
	})

	it('renvoie false pour toute autre chaîne (sérialisation inattendue)', () => {
		expect(parseDarkModeValue('1')).toBe(false)
		expect(parseDarkModeValue('')).toBe(false)
		expect(parseDarkModeValue('TRUE')).toBe(false)
		expect(parseDarkModeValue('yes')).toBe(false)
	})
})
