import { describe, expect, it } from 'vitest'

import { accepteLesCentimes } from './RuleInput'

describe('accepteLesCentimes', () => {
	it('accepte les centimes quand personne n’a demandé d’arrondi', () => {
		expect(accepteLesCentimes(undefined)).toBe(true)
		expect(accepteLesCentimes({})).toBe(true)
		expect(accepteLesCentimes({ style: 'currency', currency: 'EUR' })).toBe(
			true
		)
	})

	it('arrondit quand l’appelant le demande explicitement', () => {
		expect(accepteLesCentimes({ maximumFractionDigits: 0 })).toBe(false)
	})

	it('garde les centimes quand l’appelant en demande', () => {
		expect(accepteLesCentimes({ maximumFractionDigits: 2 })).toBe(true)
	})
})
