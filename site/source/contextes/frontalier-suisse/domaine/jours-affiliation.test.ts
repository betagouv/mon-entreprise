import { afterEach, describe, expect, it, vi } from 'vitest'

import { joursAffiliésDansAnnée, joursDansAnnée } from './jours-affiliation'

const simulerEn = (année: number): void => {
	vi.useFakeTimers()
	vi.setSystemTime(new Date(année, 5, 15))
}

afterEach(() => {
	vi.useRealTimers()
})

describe('joursAffiliésDansAnnée', () => {
	it("compte l'année entière pour une affiliation au 1er janvier sans fin", () => {
		simulerEn(2026)

		expect(joursAffiliésDansAnnée(new Date(2026, 0, 1))).toBe(365)
	})

	it("compte du jour d'affiliation au 31 décembre quand elle commence en cours d'année", () => {
		simulerEn(2026)

		expect(joursAffiliésDansAnnée(new Date(2026, 4, 1))).toBe(245)
	})

	it("compte du 1er janvier à la fin quand l'affiliation se termine en cours d'année", () => {
		simulerEn(2026)

		expect(
			joursAffiliésDansAnnée(new Date(2024, 0, 1), new Date(2026, 8, 30))
		).toBe(273)
	})

	it('compte la période entre début et fin la même année', () => {
		simulerEn(2026)

		expect(
			joursAffiliésDansAnnée(new Date(2026, 4, 1), new Date(2026, 8, 30))
		).toBe(153)
	})

	it("compte l'année entière pour une affiliation antérieure toujours en cours", () => {
		simulerEn(2026)

		expect(joursAffiliésDansAnnée(new Date(2024, 4, 1))).toBe(365)
	})

	it('borne la fin au 31 décembre quand elle est dans une année ultérieure', () => {
		simulerEn(2026)

		expect(
			joursAffiliésDansAnnée(new Date(2026, 4, 1), new Date(2030, 0, 1))
		).toBe(245)
	})

	it("compte les jours de l'année de fin pour une affiliation déjà terminée", () => {
		simulerEn(2029)

		expect(
			joursAffiliésDansAnnée(new Date(2024, 0, 1), new Date(2026, 8, 30))
		).toBe(273)
	})

	it('gère les années bissextiles', () => {
		simulerEn(2028)

		expect(joursAffiliésDansAnnée(new Date(2028, 0, 1))).toBe(366)
	})
})

describe('joursDansAnnée', () => {
	it('renvoie 365 pour une année normale et 366 pour une bissextile', () => {
		expect(joursDansAnnée(2026)).toBe(365)
		expect(joursDansAnnée(2028)).toBe(366)
	})
})
