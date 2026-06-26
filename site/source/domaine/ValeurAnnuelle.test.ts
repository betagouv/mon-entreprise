import { describe, expect, it } from 'vitest'

import {
	ValeurAnnuelle,
	valeurCourante,
	valeurPourAnnée,
} from './ValeurAnnuelle'

describe('ValeurAnnuelle', () => {
	describe('valeurPourAnnée', () => {
		const valeurs: ValeurAnnuelle<number> = {
			2018: 39_732,
			2024: 46_368,
			2026: 48_060,
		}

		it("retourne la valeur de l'année si elle est renseignée", () => {
			expect(valeurPourAnnée(valeurs, 2024)).toBe(46_368)
		})

		it('retourne le dernier en vigueur (≤ année) pour une année dans un trou de la table', () => {
			expect(valeurPourAnnée(valeurs, 2020)).toBe(39_732)
		})

		it('retourne le dernier en vigueur pour une année future non renseignée', () => {
			expect(valeurPourAnnée(valeurs, 2030)).toBe(48_060)
		})

		it("retourne la plus ancienne valeur connue si l'année précède la table", () => {
			expect(valeurPourAnnée(valeurs, 2010)).toBe(39_732)
		})
	})

	describe('valeurCourante', () => {
		it("retourne la valeur de l'année courante si elle existe", () => {
			const annéeCourante = new Date().getFullYear()
			const valeurs: ValeurAnnuelle<number> = {
				2023: 43_992,
				[annéeCourante]: 99_999,
			}

			expect(valeurCourante(valeurs)).toBe(99_999)
		})

		it("retourne la dernière valeur si l'année courante n'existe pas", () => {
			const valeurs: ValeurAnnuelle<number> = {
				2020: 41_136,
				2021: 42_000,
			}

			expect(valeurCourante(valeurs)).toBe(42_000)
		})
	})
})
