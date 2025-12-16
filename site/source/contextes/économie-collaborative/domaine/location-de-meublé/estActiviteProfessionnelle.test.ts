import { pipe } from 'effect'
import { describe, expect, it } from 'vitest'

import { eurosParAn, moins, plus } from '@/domaine/Montant'

import { estActiviteProfessionnelle } from './estActiviteProfessionnelle'
import { situationMeubléDeTourismeBuilder } from './test/situationBuilder'

const SEUIL_MEUBLÉ = eurosParAn(23_000)

describe('estActiviteProfessionnelle', () => {
	it('est faux si les recettes sont inférieures au seuil de professionalisation', () => {
		const situation = situationMeubléDeTourismeBuilder()
			.avecRecettes(pipe(SEUIL_MEUBLÉ, moins(eurosParAn(1))).valeur)
			.build()

		expect(estActiviteProfessionnelle(situation)).toBe(false)
	})

	it('est vrai si les recettes sont égales au seuil de professionalisation', () => {
		const situation = situationMeubléDeTourismeBuilder()
			.avecRecettes(SEUIL_MEUBLÉ.valeur)
			.build()

		expect(estActiviteProfessionnelle(situation)).toBe(true)
	})

	it('est vrai si les recettes sont supérieures au seuil de professionalisation', () => {
		const situation = situationMeubléDeTourismeBuilder()
			.avecRecettes(pipe(SEUIL_MEUBLÉ, plus(eurosParAn(1))).valeur)
			.build()

		expect(estActiviteProfessionnelle(situation)).toBe(true)
	})
})
