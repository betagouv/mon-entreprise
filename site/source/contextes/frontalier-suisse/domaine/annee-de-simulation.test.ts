import { afterEach, describe, expect, it, vi } from 'vitest'

import { annéeDesRevenus } from './annee-de-simulation'

const simulerEn = (année: number): void => {
	vi.useFakeTimers()
	vi.setSystemTime(new Date(année, 5, 15))
}

afterEach(() => {
	vi.useRealTimers()
})

describe('annéeDesRevenus', () => {
	it("retient l'année courante pour une affiliation en cours", () => {
		simulerEn(2026)

		expect(annéeDesRevenus(new Date(2024, 0, 1))).toBe(2026)
	})

	it("retient l'année d'affiliation lorsqu'elle est dans le futur", () => {
		simulerEn(2026)

		expect(annéeDesRevenus(new Date(2030, 0, 1))).toBe(2030)
	})

	it("retient l'année de fin lorsque l'affiliation est déjà terminée", () => {
		simulerEn(2029)

		expect(annéeDesRevenus(new Date(2024, 0, 1), new Date(2026, 8, 30))).toBe(
			2026
		)
	})

	it("reste sur l'année courante quand elle est dans la période d'affiliation", () => {
		simulerEn(2026)

		expect(annéeDesRevenus(new Date(2024, 0, 1), new Date(2030, 0, 1))).toBe(
			2026
		)
	})
})
