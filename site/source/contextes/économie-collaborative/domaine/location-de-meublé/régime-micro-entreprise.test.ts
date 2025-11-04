import { Either, Option } from 'effect'
import { describe, expect, it } from 'vitest'

import { eurosParAn } from '@/domaine/Montant'

import {
	calculeCotisationsMicroEntreprise,
	PLAFOND_MICRO_ENTREPRISE_CHAMBRE_HOTE,
	PLAFOND_MICRO_ENTREPRISE_NON_CLASSE,
	PLAFOND_MICRO_ENTREPRISE_TOURISME,
} from './régime-micro-entreprise'
import { SituationÉconomieCollaborativeValide } from './situation'

type SomeMontantParAn = Option.Some<ReturnType<typeof eurosParAn>>

describe('calculeCotisationsMicroEntreprise', () => {
	describe('plafonds selon le type de location', () => {
		it('plafond de 77 700€ pour un logement non-classé', () => {
			expect(PLAFOND_MICRO_ENTREPRISE_NON_CLASSE.valeur).toBe(77_700)
		})

		it('plafond de 188 700€ pour un logement tourisme classé', () => {
			expect(PLAFOND_MICRO_ENTREPRISE_TOURISME.valeur).toBe(188_700)
		})

		it("plafond de 188 700€ pour une chambre d'hôte", () => {
			expect(PLAFOND_MICRO_ENTREPRISE_CHAMBRE_HOTE.valeur).toBe(188_700)
		})
	})

	describe('logement non-classé', () => {
		it('calcule les cotisations pour recettes < 77 700€', () => {
			const situation: SituationÉconomieCollaborativeValide = {
				autresRevenus: Option.none(),
				typeDurée: Option.none(),
				_tag: 'Situation',
				_type: 'économie-collaborative',
				typeLocation: Option.some('non-classé' as const),
				recettes: Option.some(eurosParAn(50_000)) as SomeMontantParAn,
				estAlsaceMoselle: Option.none(),
				premièreAnnée: Option.none(),
			}

			const résultat = calculeCotisationsMicroEntreprise(situation)

			expect(Either.isRight(résultat)).toBe(true)
		})

		it('retourne une erreur pour recettes > 77 700€', () => {
			const situation: SituationÉconomieCollaborativeValide = {
				autresRevenus: Option.none(),
				typeDurée: Option.none(),
				_tag: 'Situation',
				_type: 'économie-collaborative',
				typeLocation: Option.some('non-classé' as const),
				recettes: Option.some(eurosParAn(80_000)) as SomeMontantParAn,
				estAlsaceMoselle: Option.none(),
				premièreAnnée: Option.none(),
			}

			const résultat = calculeCotisationsMicroEntreprise(situation)

			expect(Either.isLeft(résultat)).toBe(true)
		})
	})

	describe('logement tourisme classé', () => {
		it('calcule les cotisations pour recettes < 188 700€', () => {
			const situation: SituationÉconomieCollaborativeValide = {
				autresRevenus: Option.none(),
				typeDurée: Option.none(),
				_tag: 'Situation',
				_type: 'économie-collaborative',
				typeLocation: Option.some('tourisme' as const),
				recettes: Option.some(eurosParAn(150_000)) as SomeMontantParAn,
				estAlsaceMoselle: Option.none(),
				premièreAnnée: Option.none(),
			}

			const résultat = calculeCotisationsMicroEntreprise(situation)

			expect(Either.isRight(résultat)).toBe(true)
		})

		it('retourne une erreur pour recettes > 188 700€', () => {
			const situation: SituationÉconomieCollaborativeValide = {
				autresRevenus: Option.none(),
				typeDurée: Option.none(),
				_tag: 'Situation',
				_type: 'économie-collaborative',
				typeLocation: Option.some('tourisme' as const),
				recettes: Option.some(eurosParAn(200_000)) as SomeMontantParAn,
				estAlsaceMoselle: Option.none(),
				premièreAnnée: Option.none(),
			}

			const résultat = calculeCotisationsMicroEntreprise(situation)

			expect(Either.isLeft(résultat)).toBe(true)
		})
	})

	describe("chambre d'hôte", () => {
		it('calcule les cotisations pour recettes < 188 700€', () => {
			const situation: SituationÉconomieCollaborativeValide = {
				autresRevenus: Option.none(),
				typeDurée: Option.none(),
				_tag: 'Situation',
				_type: 'économie-collaborative',
				typeLocation: Option.some('chambre-hôte' as const),
				recettes: Option.some(eurosParAn(150_000)) as SomeMontantParAn,
				estAlsaceMoselle: Option.none(),
				premièreAnnée: Option.none(),
			}

			const résultat = calculeCotisationsMicroEntreprise(situation)

			expect(Either.isRight(résultat)).toBe(true)
		})

		it('retourne une erreur pour recettes > 188 700€', () => {
			const situation: SituationÉconomieCollaborativeValide = {
				autresRevenus: Option.none(),
				typeDurée: Option.none(),
				_tag: 'Situation',
				_type: 'économie-collaborative',
				typeLocation: Option.some('chambre-hôte' as const),
				recettes: Option.some(eurosParAn(200_000)) as SomeMontantParAn,
				estAlsaceMoselle: Option.none(),
				premièreAnnée: Option.none(),
			}

			const résultat = calculeCotisationsMicroEntreprise(situation)

			expect(Either.isLeft(résultat)).toBe(true)
		})
	})

	describe('sans type de location spécifié', () => {
		it('utilise le plafond non-classé par défaut (77 700€)', () => {
			const situationSousPlafond: SituationÉconomieCollaborativeValide = {
				autresRevenus: Option.none(),
				typeDurée: Option.none(),
				_tag: 'Situation',
				_type: 'économie-collaborative',
				typeLocation: Option.none(),
				recettes: Option.some(eurosParAn(50_000)) as SomeMontantParAn,
				estAlsaceMoselle: Option.none(),
				premièreAnnée: Option.none(),
			}

			const résultatSousPlafond =
				calculeCotisationsMicroEntreprise(situationSousPlafond)

			expect(Either.isRight(résultatSousPlafond)).toBe(true)
		})

		it('retourne une erreur pour recettes > 77 700€ (plafond par défaut)', () => {
			const situationAuDessusPlafond: SituationÉconomieCollaborativeValide = {
				autresRevenus: Option.none(),
				typeDurée: Option.none(),
				_tag: 'Situation',
				_type: 'économie-collaborative',
				typeLocation: Option.none(),
				recettes: Option.some(eurosParAn(80_000)) as SomeMontantParAn,
				estAlsaceMoselle: Option.none(),
				premièreAnnée: Option.none(),
			}

			const résultatAuDessusPlafond = calculeCotisationsMicroEntreprise(
				situationAuDessusPlafond
			)

			expect(Either.isLeft(résultatAuDessusPlafond)).toBe(true)
		})
	})
})
