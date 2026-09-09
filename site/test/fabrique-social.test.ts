import { describe, expect, it } from 'vitest'

import { fabriqueSocialEntrepriseAdapter } from '@/api/RechercheEntreprise/fabrique-social'

import {
	fabriqueSocialWithoutSiege,
	fabriqueSocialWithSiege,
} from './fabrique-social.fixtures'

describe('Fabrique Social', () => {
	describe('fabriqueSocialEntrepriseAdapter', () => {
		describe('Si l’entreprise est retournée avec un siège différent de la recherche', () => {
			const entreprise = fabriqueSocialEntrepriseAdapter(
				fabriqueSocialWithSiege
			)

			it('retourne le siren', () => {
				expect(entreprise.siren).toBe('849074190')
			})

			it("a l'établissement demandé dans 'établissement'", () => {
				expect(entreprise.siège?.adresse.complète).toBe(
					'23 RUE DE MOGADOR 75009 PARIS 9'
				)
			})
			it("a le siège dans 'siège'", () => {
				expect(entreprise.établissement.adresse.complète).toBe(
					'4 RUE VOLTAIRE 44000 NANTES'
				)
			})
		})
		describe("Si l'entreprise est retournée sans siège", () => {
			const entreprise = fabriqueSocialEntrepriseAdapter(
				fabriqueSocialWithoutSiege
			)

			it("n'a pas de siège", () => {
				expect(entreprise.siège?.adresse.complète).toBe(undefined)
			})
			it('a l’établissement demandé', () => {
				expect(entreprise.établissement.adresse.complète).toBe(
					'4 RUE VOLTAIRE 44000 NANTES'
				)
			})
		})
	})
})
