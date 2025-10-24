import { Either, Option as O } from 'effect'
import { describe, expect, it } from 'vitest'

import { eurosParAn } from '@/domaine/Montant'

import { calculeCotisationsRégimeGénéral } from './régime-général'
import { SituationÉconomieCollaborativeValide } from './situation'

describe('calculeCotisationsRégimeGénéral avec typeLocation', () => {
	describe('type location: non-classé', () => {
		it('devrait calculer les cotisations pour recettes < 77 700€', () => {
			const situation: SituationÉconomieCollaborativeValide = {
				_tag: 'Situation',
				typeLocation: O.some('non-classé' as const),
				recettes: O.some(eurosParAn(10_000)) as O.Some<
					ReturnType<typeof eurosParAn>
				>,
				estAlsaceMoselle: O.some(false),
				premièreAnnée: O.some(false),
			}

			const résultat = calculeCotisationsRégimeGénéral(situation)

			expect(Either.isRight(résultat)).toBe(true)
		})

		it('devrait calculer les cotisations pour recettes entre 23 000€ et 77 700€', () => {
			const situation: SituationÉconomieCollaborativeValide = {
				_tag: 'Situation',
				typeLocation: O.some('non-classé' as const),
				recettes: O.some(eurosParAn(50_000)) as O.Some<
					ReturnType<typeof eurosParAn>
				>,
				estAlsaceMoselle: O.some(false),
				premièreAnnée: O.some(false),
			}

			const résultat = calculeCotisationsRégimeGénéral(situation)

			expect(Either.isRight(résultat)).toBe(true)
		})

		it('devrait retourner une erreur pour recettes > 77 700€', () => {
			const situation: SituationÉconomieCollaborativeValide = {
				_tag: 'Situation',
				typeLocation: O.some('non-classé' as const),
				recettes: O.some(eurosParAn(80_000)) as O.Some<
					ReturnType<typeof eurosParAn>
				>,
				estAlsaceMoselle: O.some(false),
				premièreAnnée: O.some(false),
			}

			const résultat = calculeCotisationsRégimeGénéral(situation)

			expect(Either.isLeft(résultat)).toBe(true)
			if (Either.isLeft(résultat)) {
				expect(résultat.left._tag).toBe(
					'RecettesSupérieuresAuPlafondAutoriséPourCeRégime'
				)
			}
		})
	})

	describe('type location: tourisme', () => {
		it('devrait calculer les cotisations pour recettes entre 23 000€ et 77 700€', () => {
			const situation: SituationÉconomieCollaborativeValide = {
				_tag: 'Situation',
				typeLocation: O.some('tourisme' as const),
				recettes: O.some(eurosParAn(50_000)) as O.Some<
					ReturnType<typeof eurosParAn>
				>,
				estAlsaceMoselle: O.some(false),
				premièreAnnée: O.some(false),
			}

			const résultat = calculeCotisationsRégimeGénéral(situation)

			expect(Either.isRight(résultat)).toBe(true)
		})

		it('devrait retourner une erreur pour recettes > 77 700€', () => {
			const situation: SituationÉconomieCollaborativeValide = {
				_tag: 'Situation',
				typeLocation: O.some('tourisme' as const),
				recettes: O.some(eurosParAn(100_000)) as O.Some<
					ReturnType<typeof eurosParAn>
				>,
				estAlsaceMoselle: O.some(false),
				premièreAnnée: O.some(false),
			}

			const résultat = calculeCotisationsRégimeGénéral(situation)

			expect(Either.isLeft(résultat)).toBe(true)
			if (Either.isLeft(résultat)) {
				expect(résultat.left._tag).toBe(
					'RecettesSupérieuresAuPlafondAutoriséPourCeRégime'
				)
			}
		})
	})

	describe('type location: chambre-hôte', () => {
		it('devrait toujours retourner une erreur car RG non applicable pour chambre-hôte', () => {
			const situation: SituationÉconomieCollaborativeValide = {
				_tag: 'Situation',
				typeLocation: O.some('chambre-hôte' as const),
				recettes: O.some(eurosParAn(10_000)) as O.Some<
					ReturnType<typeof eurosParAn>
				>,
				estAlsaceMoselle: O.some(false),
				premièreAnnée: O.some(false),
			}

			const résultat = calculeCotisationsRégimeGénéral(situation)

			expect(Either.isLeft(résultat)).toBe(true)
			if (Either.isLeft(résultat)) {
				expect(résultat.left._tag).toBe(
					'RégimeNonApplicablePourCeTypeDeLocation'
				)
			}
		})

		it('devrait retourner une erreur même pour recettes élevées', () => {
			const situation: SituationÉconomieCollaborativeValide = {
				_tag: 'Situation',
				typeLocation: O.some('chambre-hôte' as const),
				recettes: O.some(eurosParAn(50_000)) as O.Some<
					ReturnType<typeof eurosParAn>
				>,
				estAlsaceMoselle: O.some(false),
				premièreAnnée: O.some(false),
			}

			const résultat = calculeCotisationsRégimeGénéral(situation)

			expect(Either.isLeft(résultat)).toBe(true)
			if (Either.isLeft(résultat)) {
				expect(résultat.left._tag).toBe(
					'RégimeNonApplicablePourCeTypeDeLocation'
				)
			}
		})
	})

	describe('sans typeLocation (comportement par défaut)', () => {
		it('devrait utiliser les règles pour non-classé par défaut', () => {
			const situation: SituationÉconomieCollaborativeValide = {
				_tag: 'Situation',
				typeLocation: O.none(),
				recettes: O.some(eurosParAn(50_000)) as O.Some<
					ReturnType<typeof eurosParAn>
				>,
				estAlsaceMoselle: O.some(false),
				premièreAnnée: O.some(false),
			}

			const résultat = calculeCotisationsRégimeGénéral(situation)

			expect(Either.isRight(résultat)).toBe(true)
		})
	})
})
