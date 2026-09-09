import { Equal, Option, pipe } from 'effect'
import { describe, expect, it } from 'vitest'

import { estPlusGrandQue, eurosParAn } from '@/domaine/Montant'

import { compareRégimes } from './comparateur-régimes'
import { SEUIL_PROFESSIONNALISATION } from './constantes'
import {
	RegimeCotisation,
	SituationÉconomieCollaborativeValide,
} from './situation'

describe('compareRégimes', () => {
	describe('avec des recettes inférieures au seuil de professionnalisation', () => {
		it('marque tous les régimes comme non applicables', () => {
			const situation: SituationÉconomieCollaborativeValide = {
				_tag: 'Situation',
				_type: 'économie-collaborative',
				recettes: Option.some(eurosParAn(10_000)) as Option.Some<
					typeof SEUIL_PROFESSIONNALISATION
				>,
				regimeCotisation: Option.none(),
				estAlsaceMoselle: Option.none(),
				premièreAnnée: Option.none(),
			}

			const résultats = compareRégimes(situation)

			expect(résultats.length).toBe(3)

			résultats.forEach((régime) => {
				expect(régime.applicable).toBe(false)
				expect(
					!régime.applicable && régime.raisonDeNonApplicabilité
				).toBeDefined()
			})
		})
	})

	describe('avec des recettes au-dessus du seuil mais en-dessous du plafond', () => {
		it('marque tous les régimes comme applicables', () => {
			const situation: SituationÉconomieCollaborativeValide = {
				_tag: 'Situation',
				_type: 'économie-collaborative',
				recettes: Option.some(eurosParAn(40_000)) as Option.Some<
					typeof SEUIL_PROFESSIONNALISATION
				>,
				regimeCotisation: Option.none(),
				estAlsaceMoselle: Option.none(),
				premièreAnnée: Option.none(),
			}

			const résultats = compareRégimes(situation)

			expect(résultats.length).toBe(3)

			résultats.forEach((régime) => {
				expect(régime.applicable).toBe(true)
				expect('cotisations' in régime).toBe(true)
			})
		})

		it('calcule des valeurs de cotisations différentes pour chaque régime', () => {
			const situation: SituationÉconomieCollaborativeValide = {
				_tag: 'Situation',
				_type: 'économie-collaborative',
				recettes: Option.some(eurosParAn(40_000)) as Option.Some<
					typeof SEUIL_PROFESSIONNALISATION
				>,
				regimeCotisation: Option.none(),
				estAlsaceMoselle: Option.none(),
				premièreAnnée: Option.none(),
			}

			const résultats = compareRégimes(situation)

			const régimeGénéral = résultats.find(
				(r) => r.régime === RegimeCotisation.regimeGeneral
			)
			const microEntreprise = résultats.find(
				(r) => r.régime === RegimeCotisation.microEntreprise
			)
			const travailleurIndépendant = résultats.find(
				(r) => r.régime === RegimeCotisation.travailleurIndependant
			)

			expect(régimeGénéral?.applicable).toBe(true)
			expect(microEntreprise?.applicable).toBe(true)
			expect(travailleurIndépendant?.applicable).toBe(true)

			if (
				régimeGénéral?.applicable &&
				microEntreprise?.applicable &&
				travailleurIndépendant?.applicable
			) {
				expect(
					Equal.equals(régimeGénéral.cotisations, microEntreprise.cotisations)
				).toBe(false)
				expect(
					Equal.equals(
						régimeGénéral.cotisations,
						travailleurIndépendant.cotisations
					)
				).toBe(false)
				expect(
					Equal.equals(
						microEntreprise.cotisations,
						travailleurIndépendant.cotisations
					)
				).toBe(false)
			}
		})
	})

	describe('avec des recettes supérieures au plafond du régime général', () => {
		it('devrait marquer le régime général comme non applicable', () => {
			const situation: SituationÉconomieCollaborativeValide = {
				_tag: 'Situation',
				_type: 'économie-collaborative',
				recettes: Option.some(eurosParAn(80_000)) as Option.Some<
					typeof SEUIL_PROFESSIONNALISATION
				>,
				regimeCotisation: Option.none(),
				estAlsaceMoselle: Option.none(),
				premièreAnnée: Option.none(),
			}

			const résultats = compareRégimes(situation)

			const régimeGénéral = résultats.find(
				(r) => r.régime === RegimeCotisation.regimeGeneral
			)
			const microEntreprise = résultats.find(
				(r) => r.régime === RegimeCotisation.microEntreprise
			)
			const travailleurIndépendant = résultats.find(
				(r) => r.régime === RegimeCotisation.travailleurIndependant
			)

			expect(régimeGénéral?.applicable).toBe(false)
			expect(
				régimeGénéral &&
					!régimeGénéral.applicable &&
					régimeGénéral.raisonDeNonApplicabilité
			).toBeDefined()

			expect(microEntreprise?.applicable).toBe(true)
			expect(travailleurIndépendant?.applicable).toBe(true)
		})
	})

	describe('avec un régime spécifié', () => {
		it('devrait tout de même comparer tous les régimes', () => {
			const situation: SituationÉconomieCollaborativeValide = {
				_tag: 'Situation',
				_type: 'économie-collaborative',
				recettes: Option.some(eurosParAn(40_000)) as Option.Some<
					typeof SEUIL_PROFESSIONNALISATION
				>,
				regimeCotisation: Option.some(RegimeCotisation.microEntreprise),
				estAlsaceMoselle: Option.none(),
				premièreAnnée: Option.none(),
			}

			const résultats = compareRégimes(situation)

			expect(résultats.length).toBe(3)
		})
	})

	describe('avec des paramètres supplémentaires', () => {
		it('devrait prendre en compte le paramètre estAlsaceMoselle', () => {
			const situationNormale: SituationÉconomieCollaborativeValide = {
				_tag: 'Situation',
				_type: 'économie-collaborative',
				recettes: Option.some(eurosParAn(40_000)) as Option.Some<
					typeof SEUIL_PROFESSIONNALISATION
				>,
				regimeCotisation: Option.none(),
				estAlsaceMoselle: Option.some(false),
				premièreAnnée: Option.none(),
			}

			const situationAlsaceMoselle: SituationÉconomieCollaborativeValide = {
				_tag: 'Situation',
				_type: 'économie-collaborative',
				recettes: Option.some(eurosParAn(40_000)) as Option.Some<
					typeof SEUIL_PROFESSIONNALISATION
				>,
				regimeCotisation: Option.none(),
				estAlsaceMoselle: Option.some(true),
				premièreAnnée: Option.none(),
			}

			const résultatsNormal = compareRégimes(situationNormale)
			const résultatsAlsaceMoselle = compareRégimes(situationAlsaceMoselle)

			const régimeGénéralNormal = résultatsNormal.find(
				(r) => r.régime === RegimeCotisation.regimeGeneral
			)
			const régimeGénéralAlsaceMoselle = résultatsAlsaceMoselle.find(
				(r) => r.régime === RegimeCotisation.regimeGeneral
			)

			expect(régimeGénéralNormal?.applicable).toBe(true)
			expect(régimeGénéralAlsaceMoselle?.applicable).toBe(true)

			if (
				régimeGénéralNormal?.applicable &&
				régimeGénéralAlsaceMoselle?.applicable
			) {
				expect(
					pipe(
						régimeGénéralAlsaceMoselle.cotisations,
						estPlusGrandQue(régimeGénéralNormal.cotisations)
					)
				).toBe(true)
			}
		})
	})
})
