import * as O from 'effect/Option'
import { describe, expect, it } from 'vitest'

import { euros, eurosParAn, eurosParMois } from '@/domaine/Montant'
import { testerEn } from '@/test/testerEn'

import {
	calculeCotisationMaladie,
	décomposeCotisationMaladie,
} from './cotisation'
import { SituationFrontalierSuisseValide } from './situation'

const situation = (
	salaires: number,
	autresRevenus: number,
	dateAffiliation: Date,
	dateFinAffiliation?: Date
): SituationFrontalierSuisseValide =>
	({
		_tag: 'Situation',
		_type: 'frontalier-suisse',
		dateAffiliation: O.some(dateAffiliation),
		dateFinAffiliation: O.fromNullable(dateFinAffiliation),
		salaires: O.some(eurosParAn(salaires)),
		autresRevenus: O.some(eurosParAn(autresRevenus)),
	}) as SituationFrontalierSuisseValide

describe('décomposeCotisationMaladie', () => {
	it("reproduit l'exemple du simulateur Urssaf (PASS 2018, année pleine)", () => {
		testerEn(2018)

		const résultat = décomposeCotisationMaladie(
			situation(45_000, 10_000, new Date(2017, 0, 1))
		)

		expect(résultat.annuel).toEqual(eurosParAn(3_605))
		expect(résultat.mensuel).toEqual(eurosParMois(300))
		expect(résultat.prorataAnnéePartielle).toEqual(O.none())
	})

	it('calcule la cotisation 2026 pour une année pleine, sans prorata', () => {
		testerEn(2026)

		const résultat = décomposeCotisationMaladie(
			situation(45_000, 10_000, new Date(2023, 0, 1))
		)

		expect(résultat.annuel).toEqual(eurosParAn(3_439))
		expect(résultat.mensuel).toEqual(eurosParMois(287))
		expect(résultat.prorataAnnéePartielle).toEqual(O.none())
	})

	it('mensualise toujours sur 12 mois (coût récurrent)', () => {
		testerEn(2026)

		const résultat = décomposeCotisationMaladie(
			situation(45_000, 10_000, new Date(2023, 0, 1))
		)

		expect(résultat.mensuel).toEqual(
			eurosParMois(Math.round(résultat.annuel.valeur / 12))
		)
	})

	it("expose une cotisation proratisée pour une affiliation en cours d'année", () => {
		testerEn(2026)

		const résultat = décomposeCotisationMaladie(
			situation(45_000, 10_000, new Date(2026, 4, 1))
		)

		expect(résultat.annuel).toEqual(eurosParAn(3_439))
		expect(résultat.mensuel).toEqual(eurosParMois(287))
		expect(résultat.prorataAnnéePartielle).toEqual(O.some(euros(2_308)))
	})

	it("ne proratise pas une affiliation d'une année antérieure à l'année de cotisation", () => {
		testerEn(2026)

		const résultat = décomposeCotisationMaladie(
			situation(45_000, 10_000, new Date(2024, 4, 1))
		)

		expect(résultat.prorataAnnéePartielle).toEqual(O.none())
	})

	it("suit l'année d'affiliation lorsqu'elle est dans le futur et la proratise", () => {
		testerEn(2026)

		const résultat = décomposeCotisationMaladie(
			situation(45_000, 10_000, new Date(2030, 4, 1))
		)

		expect(résultat.prorataAnnéePartielle).toEqual(O.some(euros(2_308)))
	})

	it("proratise l'année lorsque l'affiliation se termine en cours d'année", () => {
		testerEn(2026)

		const résultat = décomposeCotisationMaladie(
			situation(45_000, 10_000, new Date(2024, 0, 1), new Date(2026, 8, 30))
		)

		expect(résultat.annuel).toEqual(eurosParAn(3_439))
		expect(résultat.prorataAnnéePartielle).toEqual(O.some(euros(2_572)))
	})

	it("retient l'année de fin pour une affiliation déjà terminée", () => {
		testerEn(2029)

		const résultat = décomposeCotisationMaladie(
			situation(45_000, 10_000, new Date(2024, 0, 1), new Date(2026, 8, 30))
		)

		expect(résultat.annuel).toEqual(eurosParAn(3_439))
		expect(résultat.prorataAnnéePartielle).toEqual(O.some(euros(2_572)))
	})

	it('renvoie une cotisation nulle quand les revenus sont inférieurs à l’abattement', () => {
		testerEn(2026)

		const résultat = décomposeCotisationMaladie(
			situation(5_000, 0, new Date(2023, 0, 1))
		)

		expect(résultat.annuel).toEqual(eurosParAn(0))
		expect(résultat.mensuel).toEqual(eurosParMois(0))
	})

	it("traite l'absence d'autres revenus comme zéro", () => {
		testerEn(2026)

		const sansAutresRevenus = {
			...situation(45_000, 0, new Date(2023, 0, 1)),
			autresRevenus: O.none(),
		} as SituationFrontalierSuisseValide

		const détail = décomposeCotisationMaladie(sansAutresRevenus)

		expect(détail.autresRevenus).toEqual(eurosParAn(0))
		expect(détail.assiette).toEqual(eurosParAn(45_000))
	})

	it('expose les étapes dépendant de la saisie', () => {
		testerEn(2026)

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
		testerEn(2026)

		const situationProratisée = situation(45_000, 10_000, new Date(2026, 4, 1))
		const { annuel, mensuel, prorataAnnéePartielle } =
			décomposeCotisationMaladie(situationProratisée)

		expect(calculeCotisationMaladie(situationProratisée)).toEqual({
			annuel,
			mensuel,
			prorataAnnéePartielle,
		})
	})
})
