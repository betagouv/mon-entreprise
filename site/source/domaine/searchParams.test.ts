import { Names } from 'modele-social/dist/names'
import {
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	vi,
	type MockInstance,
} from 'vitest'

import { eurosParMois, eurosParTitreRestaurant } from './Montant'
import {
	heuresParMois,
	joursOuvrés,
	pourcentage,
	titresRestaurantParMois,
} from './Quantité'
import {
	getSearchParamsFromSituation,
	getSituationFromSearchParams,
	getTargetUnitFromSearchParams,
} from './searchParams'

describe('searchParams', () => {
	describe('getSearchParamsFromSituation', () => {
		let consoleError: MockInstance

		beforeEach(() => {
			consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
		})

		afterEach(() => {
			consoleError.mockRestore()
		})

		it('ignore silencieusement les expressions Publicodes complexes (objets sans tag domaine)', () => {
			const situation = {
				'salarié . contrat . salaire brut': '2700 €/mois',
				'impôt . méthode de calcul . par défaut': {
					variations: [
						{
							si: 'salarié . contrat . salaire brut <= 6000 €/mois',
							alors: "'taux neutre'",
						},
						{ sinon: "'barème standard'" },
					],
				},
				'salarié . cotisations . prévoyances': {
					'applicable si': 'non',
				},
			}

			const result = getSearchParamsFromSituation(situation as never, '€/mois')

			expect(result.get('salarié . contrat . salaire brut')).toBe('2700 €/mois')
			expect(result.has('impôt . méthode de calcul . par défaut')).toBe(false)
			expect(result.has('salarié . cotisations . prévoyances')).toBe(false)
			expect(consoleError).not.toHaveBeenCalled()
		})

		it('encode les expressions Publicodes simples {valeur, unité} sans tag domaine', () => {
			const situation = {
				'salarié . cotisations . prévoyances . santé . taux employeur': {
					valeur: 50,
					unité: '%',
				},
				'impôt . foyer fiscal . enfants à charge': {
					valeur: 2,
					unité: 'enfant',
				},
				'salarié . contrat . salaire brut': '2700 €/mois',
			}

			const result = getSearchParamsFromSituation(situation as never, '€/mois')

			expect(
				result.get(
					'salarié . cotisations . prévoyances . santé . taux employeur'
				)
			).toBe('50 %')
			expect(result.get('impôt . foyer fiscal . enfants à charge')).toBe(
				'2 enfant'
			)
			expect(result.get('salarié . contrat . salaire brut')).toBe('2700 €/mois')
			expect(consoleError).not.toHaveBeenCalled()
		})

		it('construit des search params à partir d’une situation Publicodes et d’une unité cible', () => {
			const situation = {
				'salarié . contrat': 'CDD',
				'salarié . contrat . CDD . congés pris': '2.08 jours ouvrés',
				'salarié . contrat . salaire brut': '2700 €/mois',
				'salarié . rémunération . frais professionnels . titres-restaurant':
					'oui',
				'salarié . rémunération . frais professionnels . titres-restaurant . montant unitaire':
					'12 €/titre-restaurant',
				'salarié . rémunération . frais professionnels . titres-restaurant . nombre':
					'22 titre-restaurant/mois',
				'salarié . rémunération . frais professionnels . titres-restaurant . taux employeur':
					'60%',
				'salarié . temps de travail . heures supplémentaires':
					'17.33 heures/mois',
			}

			const result = getSearchParamsFromSituation(situation, '€/mois')

			expect(result.toString()).toBe(
				new URLSearchParams({
					...situation,
					unité: '€/mois',
				}).toString()
			)
		})

		it('construit des search params à partir d’une situation vide', () => {
			const result = getSearchParamsFromSituation({}, '€/mois')
			expect(result.toString()).toBe('unit%C3%A9=%E2%82%AC%2Fmois')
		})
	})

	describe('getSituationFromSearchParams', () => {
		it('construit une situation à partir de search params', () => {
			const rules = [
				'salarié . contrat',
				'salarié . contrat . CDD . congés pris',
				'salarié . contrat . salaire brut',
				'salarié . rémunération . frais professionnels . titres-restaurant',
				'salarié . rémunération . frais professionnels . titres-restaurant . montant unitaire',
				'salarié . rémunération . frais professionnels . titres-restaurant . nombre',
				'salarié . rémunération . frais professionnels . titres-restaurant . taux employeur',
				'salarié . temps de travail . heures supplémentaires',
			] as Names[]

			const result = getSituationFromSearchParams(
				new URLSearchParams({
					'salarié . contrat': 'CDD',
					'salarié . contrat . CDD . congés pris': '2.08 jours ouvrés',
					'salarié . contrat . salaire brut': '2700 €/mois',
					'salarié . rémunération . frais professionnels . titres-restaurant':
						'oui',
					'salarié . rémunération . frais professionnels . titres-restaurant . montant unitaire':
						'12 €/titre-restaurant',
					'salarié . rémunération . frais professionnels . titres-restaurant . nombre':
						'22 titre-restaurant/mois',
					'salarié . rémunération . frais professionnels . titres-restaurant . taux employeur':
						'60%',
					'salarié . temps de travail . heures supplémentaires':
						'17.33 heures/mois',
					unité: '€/mois',
				}),
				rules
			)

			expect(result['salarié . contrat']).toEqual('CDD')
			expect(result['salarié . contrat . CDD . congés pris']).toEqual(
				joursOuvrés(2.08)
			)
			expect(result['salarié . contrat . salaire brut']).toEqual(
				eurosParMois(2700)
			)
			expect(
				result[
					'salarié . rémunération . frais professionnels . titres-restaurant'
				]
			).toEqual('oui')
			expect(
				result[
					'salarié . rémunération . frais professionnels . titres-restaurant . montant unitaire'
				]
			).toEqual(eurosParTitreRestaurant(12))
			expect(
				result[
					'salarié . rémunération . frais professionnels . titres-restaurant . nombre'
				]
			).toEqual(titresRestaurantParMois(22))
			expect(
				result[
					'salarié . rémunération . frais professionnels . titres-restaurant . taux employeur'
				]
			).toEqual(pourcentage(60))
			expect(
				result['salarié . temps de travail . heures supplémentaires']
			).toEqual(heuresParMois(17.33))
			expect(result['salarié . contrat . CDD . durée']).toEqual(undefined)
		})

		it('n’inclue pas les search params qui ne sont pas dans les règles fournies', () => {
			const rules = ['salarié . contrat'] as Names[]

			const result = getSituationFromSearchParams(
				new URLSearchParams({
					'salarié . contrat': 'CDD',
					'salarié . contrat . CDD . congés pris': '2.08 jours ouvrés',
				}),
				rules
			)

			expect(result['salarié . contrat']).toEqual('CDD')
			expect(result['salarié . contrat . CDD . congés pris']).toEqual(undefined)
		})

		it('construit une situation vide à partir de search params absents', () => {
			const rules = ['salarié . contrat'] as Names[]

			const result = getSituationFromSearchParams(
				new URLSearchParams(''),
				rules
			)

			expect(result).toEqual({})
		})
	})

	describe('getTargetUnitFromSearchParams', () => {
		it('récupère l’unité cible à partir des search params', () => {
			const result = getTargetUnitFromSearchParams(
				new URLSearchParams({ unité: '€/mois' })
			)

			expect(result).toEqual('€/mois')
		})

		it('retourne null si l’unité cible est absente des search params', () => {
			const result = getTargetUnitFromSearchParams(new URLSearchParams(''))

			expect(result).toEqual(null)
		})
	})
})
