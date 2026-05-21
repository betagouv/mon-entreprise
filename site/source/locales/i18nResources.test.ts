import { describe, expect, it } from 'vitest'

import { parseLangue } from './i18nResources'

describe('parseLangue', () => {
	it('renvoie "fr" pour la chaîne "fr"', () => {
		expect(parseLangue('fr')).toBe('fr')
	})

	it('renvoie "en" pour la chaîne "en"', () => {
		expect(parseLangue('en')).toBe('en')
	})

	it('renvoie "fr" par défaut quand la valeur est undefined', () => {
		expect(parseLangue(undefined)).toBe('fr')
	})

	it('lève une erreur explicite pour une langue non supportée', () => {
		expect(() => parseLangue('es')).toThrowError(
			'LANGUE invalide : "es". Valeurs supportées : fr, en.'
		)
	})
})
