import { describe, expect, it } from 'vitest'

import { joursDansAnnée, nombreDeJoursAffiliation } from './jours-affiliation'

describe('nombreDeJoursAffiliation', () => {
	it("compte l'année entière pour une affiliation au 1er janvier", () => {
		expect(nombreDeJoursAffiliation(new Date(2026, 0, 1))).toBe(365)
	})

	it("compte du jour d'affiliation au 31 décembre inclus", () => {
		expect(nombreDeJoursAffiliation(new Date(2026, 4, 1))).toBe(245)
	})

	it('compte un seul jour pour une affiliation le 31 décembre', () => {
		expect(nombreDeJoursAffiliation(new Date(2026, 11, 31))).toBe(1)
	})

	it("compte 366 jours pour une affiliation au 1er janvier d'une année bissextile", () => {
		expect(nombreDeJoursAffiliation(new Date(2028, 0, 1))).toBe(366)
	})

	it('compte le 29 février pour une affiliation en cours d’année bissextile', () => {
		expect(nombreDeJoursAffiliation(new Date(2028, 1, 1))).toBe(335)
	})
})

describe('joursDansAnnée', () => {
	it('renvoie 365 pour une année normale et 366 pour une bissextile', () => {
		expect(joursDansAnnée(2026)).toBe(365)
		expect(joursDansAnnée(2028)).toBe(366)
	})
})
