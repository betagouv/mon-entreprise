import { describe, expect, it } from 'vitest'

import { roundedPercentages } from '@/utils/number'

describe('roundedPercentages', () => {
	it('rounds percentages correctly', () => {
		expect(
			roundedPercentages({ revenu: 50, cotisations: 25, impôt: 25 })
		).toEqual({ revenu: 50, cotisations: 25, impôt: 25 })
		expect(
			roundedPercentages({ revenu: 501, cotisations: 251, impôt: 248 })
		).toEqual({ revenu: 50.1, cotisations: 25.1, impôt: 24.8 })
		expect(
			roundedPercentages({ revenu: 5001, cotisations: 2507, impôt: 2492 })
		).toEqual({ revenu: 50.0, cotisations: 25.1, impôt: 24.9 })
		expect(
			roundedPercentages({ revenu: 5004, cotisations: 2504, impôt: 2492 })
		).toEqual({
			revenu: 50.0,
			cotisations: 25.1, // et pas 25.0
			impôt: 24.9,
		})
		expect(
			roundedPercentages({ revenu: 5003, cotisations: 2503, impôt: 2494 })
		).toEqual({
			revenu: 50.0,
			cotisations: 25.0,
			impôt: 25.0, // et pas 24.9
		})
		expect(
			roundedPercentages({ revenu: 5004, cotisations: 2503, impôt: 2493 })
		).toEqual({
			revenu: 50.1, // et pas 50.0
			cotisations: 25.0,
			impôt: 24.9,
		})
	})
})
