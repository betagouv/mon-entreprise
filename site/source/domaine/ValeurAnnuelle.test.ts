import { describe, expect, it } from 'vitest'

import { ValeurAnnuelle, valeurCourante } from './ValeurAnnuelle'

describe('ValeurAnnuelle', () => {
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
