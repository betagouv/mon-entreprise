import { describe, expect, it } from 'vitest'

import { testerEn } from '@/test/testerEn'

import { annéeDesRevenus } from './annee-de-simulation'

describe('annéeDesRevenus', () => {
	it("retient l'année courante pour une affiliation en cours", () => {
		testerEn(2026)

		expect(annéeDesRevenus(new Date(2024, 0, 1))).toBe(2026)
	})

	it("retient l'année d'affiliation lorsqu'elle est dans le futur", () => {
		testerEn(2026)

		expect(annéeDesRevenus(new Date(2030, 0, 1))).toBe(2030)
	})

	it("retient l'année de fin lorsque l'affiliation est déjà terminée", () => {
		testerEn(2029)

		expect(annéeDesRevenus(new Date(2024, 0, 1), new Date(2026, 8, 30))).toBe(
			2026
		)
	})

	it("reste sur l'année courante quand elle est dans la période d'affiliation", () => {
		testerEn(2026)

		expect(annéeDesRevenus(new Date(2024, 0, 1), new Date(2030, 0, 1))).toBe(
			2026
		)
	})
})
