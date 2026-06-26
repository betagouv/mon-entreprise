import * as O from 'effect/Option'
import { describe, expect, it } from 'vitest'

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

describe('calculeCotisationMaladie', () => {
	it("reproduit l'exemple du simulateur Urssaf (PASS 2018, année pleine)", () => {
		const résultat = calculeCotisationMaladie(
			situation(45_000, 10_000, new Date(2017, 0, 1)),
			2018
		)

		expect(résultat.annuel).toEqual(eurosParAn(3605))
		expect(résultat.mensuel).toEqual(eurosParMois(300))
		expect(résultat.prorataPremièreAnnée).toEqual(O.none())
	})

	it('calcule la cotisation 2026 pour une année pleine, sans prorata', () => {
		const résultat = calculeCotisationMaladie(
			situation(45_000, 10_000, new Date(2023, 0, 1)),
			2026
		)

		expect(résultat.annuel).toEqual(eurosParAn(3439))
		expect(résultat.mensuel).toEqual(eurosParMois(287))
		expect(résultat.prorataPremièreAnnée).toEqual(O.none())
	})

	it('mensualise toujours sur 12 mois (coût récurrent)', () => {
		const résultat = calculeCotisationMaladie(
			situation(45_000, 10_000, new Date(2023, 0, 1)),
			2026
		)

		expect(résultat.mensuel).toEqual(
			eurosParMois(Math.round(résultat.annuel.valeur / 12))
		)
	})

	it("expose une cotisation proratisée pour une affiliation en cours d'année", () => {
		const résultat = calculeCotisationMaladie(
			situation(45_000, 10_000, new Date(2026, 4, 1)),
			2026
		)

		expect(résultat.annuel).toEqual(eurosParAn(3439))
		expect(résultat.mensuel).toEqual(eurosParMois(287))
		expect(résultat.prorataPremièreAnnée).toEqual(O.some(euros(2308)))
	})

	it("ne proratise pas une affiliation d'une année antérieure à l'année de cotisation", () => {
		const résultat = calculeCotisationMaladie(
			situation(45_000, 10_000, new Date(2024, 4, 1)),
			2026
		)

		expect(résultat.prorataPremièreAnnée).toEqual(O.none())
	})

	it('proratise l’année d’affiliation lorsque la simulation porte sur cette année', () => {
		const résultat = calculeCotisationMaladie(
			situation(45_000, 10_000, new Date(2030, 4, 1)),
			2030
		)

		expect(résultat.prorataPremièreAnnée).toEqual(O.some(euros(2308)))
	})

	it('renvoie une cotisation nulle quand les revenus sont inférieurs à l’abattement', () => {
		const résultat = calculeCotisationMaladie(
			situation(5_000, 0, new Date(2023, 0, 1)),
			2026
		)

		expect(résultat.annuel).toEqual(eurosParAn(0))
		expect(résultat.mensuel).toEqual(eurosParMois(0))
	})

	it("additionne salaires et autres revenus dans l'assiette", () => {
		const séparé = calculeCotisationMaladie(
			situation(30_000, 25_000, new Date(2023, 0, 1)),
			2026
		)
		const regroupé = calculeCotisationMaladie(
			situation(55_000, 0, new Date(2023, 0, 1)),
			2026
		)

		expect(séparé.annuel).toEqual(regroupé.annuel)
	})
})

describe('décomposeCotisationMaladie', () => {
	it('expose les étapes dépendant de la saisie', () => {
		const détail = décomposeCotisationMaladie(
			situation(45_000, 10_000, new Date(2023, 0, 1)),
			2026
		)

		expect(détail.assiette).toEqual(eurosParAn(55_000))
		expect(détail.base).toEqual(eurosParAn(42_985))
		expect(détail.annuel).toEqual(eurosParAn(3439))
		expect(détail.joursAffiliation).toBe(365)
	})
})
