import * as O from 'effect/Option'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { euros, eurosParAn, eurosParMois } from '@/domaine/Montant'

import {
	calculeCotisationMaladie,
	décomposeCotisationMaladie,
} from './cotisation'
import { SituationFrontalierSuisseValide } from './situation'

const situation = (
	salaires: number,
	autresRevenus: number,
	dateAffiliation: Date
): SituationFrontalierSuisseValide =>
	({
		_tag: 'Situation',
		_type: 'frontalier-suisse',
		dateAffiliation: O.some(dateAffiliation),
		salaires: O.some(eurosParAn(salaires)),
		autresRevenus: O.some(eurosParAn(autresRevenus)),
	}) as SituationFrontalierSuisseValide

const simulerEn = (année: number): void => {
	vi.useFakeTimers()
	vi.setSystemTime(new Date(année, 5, 15))
}

afterEach(() => {
	vi.useRealTimers()
})

describe('décomposeCotisationMaladie', () => {
	it("reproduit l'exemple du simulateur Urssaf (PASS 2018, année pleine)", () => {
		simulerEn(2018)

		const résultat = décomposeCotisationMaladie(
			situation(45_000, 10_000, new Date(2017, 0, 1))
		)

		expect(résultat.annuel).toEqual(eurosParAn(3_605))
		expect(résultat.mensuel).toEqual(eurosParMois(300))
		expect(résultat.prorataPremièreAnnée).toEqual(O.none())
	})

	it('calcule la cotisation 2026 pour une année pleine, sans prorata', () => {
		simulerEn(2026)

		const résultat = décomposeCotisationMaladie(
			situation(45_000, 10_000, new Date(2023, 0, 1))
		)

		expect(résultat.annuel).toEqual(eurosParAn(3_439))
		expect(résultat.mensuel).toEqual(eurosParMois(287))
		expect(résultat.prorataPremièreAnnée).toEqual(O.none())
	})

	it('mensualise toujours sur 12 mois (coût récurrent)', () => {
		simulerEn(2026)

		const résultat = décomposeCotisationMaladie(
			situation(45_000, 10_000, new Date(2023, 0, 1))
		)

		expect(résultat.mensuel).toEqual(
			eurosParMois(Math.round(résultat.annuel.valeur / 12))
		)
	})

	it("expose une cotisation proratisée pour une affiliation en cours d'année", () => {
		simulerEn(2026)

		const résultat = décomposeCotisationMaladie(
			situation(45_000, 10_000, new Date(2026, 4, 1))
		)

		expect(résultat.annuel).toEqual(eurosParAn(3_439))
		expect(résultat.mensuel).toEqual(eurosParMois(287))
		expect(résultat.prorataPremièreAnnée).toEqual(O.some(euros(2_308)))
	})

	it("ne proratise pas une affiliation d'une année antérieure à l'année de cotisation", () => {
		simulerEn(2026)

		const résultat = décomposeCotisationMaladie(
			situation(45_000, 10_000, new Date(2024, 4, 1))
		)

		expect(résultat.prorataPremièreAnnée).toEqual(O.none())
	})

	it("suit l'année d'affiliation lorsqu'elle est dans le futur et la proratise", () => {
		simulerEn(2026)

		const résultat = décomposeCotisationMaladie(
			situation(45_000, 10_000, new Date(2030, 4, 1))
		)

		expect(résultat.prorataPremièreAnnée).toEqual(O.some(euros(2_308)))
	})

	it('renvoie une cotisation nulle quand les revenus sont inférieurs à l’abattement', () => {
		simulerEn(2026)

		const résultat = décomposeCotisationMaladie(
			situation(5_000, 0, new Date(2023, 0, 1))
		)

		expect(résultat.annuel).toEqual(eurosParAn(0))
		expect(résultat.mensuel).toEqual(eurosParMois(0))
	})

	it("additionne salaires et autres revenus dans l'assiette", () => {
		simulerEn(2026)

		const séparé = décomposeCotisationMaladie(
			situation(30_000, 25_000, new Date(2023, 0, 1))
		)
		const regroupé = décomposeCotisationMaladie(
			situation(55_000, 0, new Date(2023, 0, 1))
		)

		expect(séparé.annuel).toEqual(regroupé.annuel)
	})

	it('expose les étapes dépendant de la saisie', () => {
		simulerEn(2026)

		const détail = décomposeCotisationMaladie(
			situation(45_000, 10_000, new Date(2023, 0, 1))
		)

		expect(détail.assiette).toEqual(eurosParAn(55_000))
		expect(détail.base).toEqual(eurosParAn(42_985))
		expect(détail.annuel).toEqual(eurosParAn(3_439))
		expect(détail.joursAffiliation).toBe(365)
	})
})

describe('calculeCotisationMaladie', () => {
	it('expose le sous-ensemble annuel / mensuel / prorata de la décomposition', () => {
		simulerEn(2026)

		const situationProratisée = situation(45_000, 10_000, new Date(2026, 4, 1))
		const { annuel, mensuel, prorataPremièreAnnée } =
			décomposeCotisationMaladie(situationProratisée)

		expect(calculeCotisationMaladie(situationProratisée)).toEqual({
			annuel,
			mensuel,
			prorataPremièreAnnée,
		})
	})
})
