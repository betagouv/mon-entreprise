import { pipe } from 'effect'
import { describe, expect, it } from 'vitest'

import { estActiviteProfessionnelle } from '@/domaine/économie-collaborative/location-de-meublé/activite'
import { eurosParAn, moins, plus } from '@/domaine/Montant'

import { SEUIL_PROFESSIONNALISATION } from './constantes'
import { SituationLocationCourteDuree } from './situation'

describe('estActiviteProfessionnelle', () => {
	it('est faux si les recettes sont inférieures au seuil de professionalisation', () => {
		const situation: SituationLocationCourteDuree = {
			recettes: pipe(SEUIL_PROFESSIONNALISATION, moins(eurosParAn(1))),
		}

		expect(estActiviteProfessionnelle(situation)).toBe(false)
	})

	it('est vrai si les recettes sont égales au seuil de professionalisation', () => {
		const situation: SituationLocationCourteDuree = {
			recettes: SEUIL_PROFESSIONNALISATION,
		}

		expect(estActiviteProfessionnelle(situation)).toBe(true)
	})

	it('est vrai si les recettes sont supérieures au seuil de professionalisation', () => {
		const situation: SituationLocationCourteDuree = {
			recettes: pipe(SEUIL_PROFESSIONNALISATION, plus(eurosParAn(1))),
		}

		expect(estActiviteProfessionnelle(situation)).toBe(true)
	})
})
