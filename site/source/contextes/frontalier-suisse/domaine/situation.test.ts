import * as O from 'effect/Option'
import { describe, expect, it } from 'vitest'

import { eurosParAn } from '@/domaine/MontantRécurrent'

import {
	datesAffiliationCohérentes,
	estSituationValide,
	initialSituationFrontalierSuisse,
} from './situation'

const avec = (champs: Partial<typeof initialSituationFrontalierSuisse>) => ({
	...initialSituationFrontalierSuisse,
	...champs,
})

describe('estSituationValide', () => {
	it('exige la date d’affiliation et les salaires', () => {
		const situation = avec({
			dateAffiliation: O.some(new Date(2026, 0, 1)),
			salaires: O.some(eurosParAn(45_000)),
		})

		expect(estSituationValide(situation)).toBe(true)
	})

	it('n’exige pas les autres revenus', () => {
		const situation = avec({
			dateAffiliation: O.some(new Date(2026, 0, 1)),
			salaires: O.some(eurosParAn(45_000)),
			autresRevenus: O.none(),
		})

		expect(estSituationValide(situation)).toBe(true)
	})

	it('est invalide sans salaires', () => {
		const situation = avec({ dateAffiliation: O.some(new Date(2026, 0, 1)) })

		expect(estSituationValide(situation)).toBe(false)
	})

	it('est invalide sans date d’affiliation', () => {
		const situation = avec({ salaires: O.some(eurosParAn(45_000)) })

		expect(estSituationValide(situation)).toBe(false)
	})

	it('est invalide quand la fin d’affiliation précède le début', () => {
		const situation = avec({
			dateAffiliation: O.some(new Date(2026, 5, 15)),
			dateFinAffiliation: O.some(new Date(2026, 0, 1)),
			salaires: O.some(eurosParAn(45_000)),
		})

		expect(estSituationValide(situation)).toBe(false)
	})

	it('reste valide quand début et fin sont le même jour', () => {
		const situation = avec({
			dateAffiliation: O.some(new Date(2026, 5, 15)),
			dateFinAffiliation: O.some(new Date(2026, 5, 15)),
			salaires: O.some(eurosParAn(45_000)),
		})

		expect(estSituationValide(situation)).toBe(true)
	})
})

describe('datesAffiliationCohérentes', () => {
	it('est cohérente tant que la fin d’affiliation n’est pas renseignée', () => {
		const situation = avec({
			dateAffiliation: O.some(new Date(2026, 5, 15)),
		})

		expect(datesAffiliationCohérentes(situation)).toBe(true)
	})

	it('est incohérente quand la fin précède le début', () => {
		const situation = avec({
			dateAffiliation: O.some(new Date(2026, 5, 15)),
			dateFinAffiliation: O.some(new Date(2026, 0, 1)),
		})

		expect(datesAffiliationCohérentes(situation)).toBe(false)
	})
})
