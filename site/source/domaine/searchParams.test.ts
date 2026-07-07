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
} from './Quantite'
import {
	getRèglesIgnoréesFromSearchParams,
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
				'salarie . contrat . salaire brut': '2700 €/mois',
				'impôt . méthode de calcul . par défaut': {
					variations: [
						{
							si: 'salarie . contrat . salaire brut <= 6000 €/mois',
							alors: "'taux neutre'",
						},
						{ sinon: "'barème standard'" },
					],
				},
				'salarie . cotisations . prévoyances': {
					'applicable si': 'non',
				},
			}

			const result = getSearchParamsFromSituation(situation as never, '€/mois')

			expect(result.get('salarie . contrat . salaire brut')).toBe('2700 €/mois')
			expect(result.has('impôt . méthode de calcul . par défaut')).toBe(false)
			expect(result.has('salarie . cotisations . prévoyances')).toBe(false)
			expect(consoleError).not.toHaveBeenCalled()
		})

		it('encode les expressions Publicodes simples {valeur, unité} sans tag domaine', () => {
			const situation = {
				'salarie . cotisations . prévoyances . santé . taux employeur': {
					valeur: 50,
					unité: '%',
				},
				'impôt . foyer fiscal . enfants à charge': {
					valeur: 2,
					unité: 'enfant',
				},
				'salarie . contrat . salaire brut': '2700 €/mois',
			}

			const result = getSearchParamsFromSituation(situation as never, '€/mois')

			expect(
				result.get(
					'salarie . cotisations . prévoyances . santé . taux employeur'
				)
			).toBe('50 %')
			expect(result.get('impôt . foyer fiscal . enfants à charge')).toBe(
				'2 enfant'
			)
			expect(result.get('salarie . contrat . salaire brut')).toBe('2700 €/mois')
			expect(consoleError).not.toHaveBeenCalled()
		})

		it('construit des search params à partir d’une situation Publicodes et d’une unité cible', () => {
			const situation = {
				'salarie . contrat': 'CDD',
				'salarie . contrat . CDD . congés pris': '2.08 jours ouvrés',
				'salarie . contrat . salaire brut': '2700 €/mois',
				'salarie . rémunération . frais professionnels . titres-restaurant':
					'oui',
				'salarie . rémunération . frais professionnels . titres-restaurant . montant unitaire':
					'12 €/titre-restaurant',
				'salarie . rémunération . frais professionnels . titres-restaurant . nombre':
					'22 titre-restaurant/mois',
				'salarie . rémunération . frais professionnels . titres-restaurant . taux employeur':
					'60%',
				'salarie . temps de travail . heures supplémentaires':
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
				'salarie . contrat',
				'salarie . contrat . CDD . congés pris',
				'salarie . contrat . salaire brut',
				'salarie . rémunération . frais professionnels . titres-restaurant',
				'salarie . rémunération . frais professionnels . titres-restaurant . montant unitaire',
				'salarie . rémunération . frais professionnels . titres-restaurant . nombre',
				'salarie . rémunération . frais professionnels . titres-restaurant . taux employeur',
				'salarie . temps de travail . heures supplémentaires',
			] as Names[]

			const result = getSituationFromSearchParams(
				new URLSearchParams({
					'salarie . contrat': 'CDD',
					'salarie . contrat . CDD . congés pris': '2.08 jours ouvrés',
					'salarie . contrat . salaire brut': '2700 €/mois',
					'salarie . rémunération . frais professionnels . titres-restaurant':
						'oui',
					'salarie . rémunération . frais professionnels . titres-restaurant . montant unitaire':
						'12 €/titre-restaurant',
					'salarie . rémunération . frais professionnels . titres-restaurant . nombre':
						'22 titre-restaurant/mois',
					'salarie . rémunération . frais professionnels . titres-restaurant . taux employeur':
						'60%',
					'salarie . temps de travail . heures supplémentaires':
						'17.33 heures/mois',
					unité: '€/mois',
				}),
				rules
			)

			expect(result['salarie . contrat']).toEqual('CDD')
			expect(result['salarie . contrat . CDD . congés pris']).toEqual(
				joursOuvrés(2.08)
			)
			expect(result['salarie . contrat . salaire brut']).toEqual(
				eurosParMois(2700)
			)
			expect(
				result[
					'salarie . rémunération . frais professionnels . titres-restaurant'
				]
			).toEqual('oui')
			expect(
				result[
					'salarie . rémunération . frais professionnels . titres-restaurant . montant unitaire'
				]
			).toEqual(eurosParTitreRestaurant(12))
			expect(
				result[
					'salarie . rémunération . frais professionnels . titres-restaurant . nombre'
				]
			).toEqual(titresRestaurantParMois(22))
			expect(
				result[
					'salarie . rémunération . frais professionnels . titres-restaurant . taux employeur'
				]
			).toEqual(pourcentage(60))
			expect(
				result['salarie . temps de travail . heures supplémentaires']
			).toEqual(heuresParMois(17.33))
			expect(result['salarie . contrat . CDD . durée']).toEqual(undefined)
		})

		it('n’inclue pas les search params qui ne sont pas dans les règles fournies', () => {
			const rules = ['salarie . contrat'] as Names[]

			const result = getSituationFromSearchParams(
				new URLSearchParams({
					'salarie . contrat': 'CDD',
					'salarie . contrat . CDD . congés pris': '2.08 jours ouvrés',
				}),
				rules
			)

			expect(result['salarie . contrat']).toEqual('CDD')
			expect(result['salarie . contrat . CDD . congés pris']).toEqual(undefined)
		})

		it('construit une situation vide à partir de search params absents', () => {
			const rules = ['salarie . contrat'] as Names[]

			const result = getSituationFromSearchParams(
				new URLSearchParams(''),
				rules
			)

			expect(result).toEqual({})
		})
	})

	describe('getRèglesIgnoréesFromSearchParams', () => {
		it('retourne un tableau vide quand tous les params correspondent à des règles', () => {
			const rules = [
				'salarie . contrat',
				'salarie . contrat . salaire brut',
			] as Names[]

			const result = getRèglesIgnoréesFromSearchParams(
				new URLSearchParams({
					'salarie . contrat': 'CDD',
					'salarie . contrat . salaire brut': '2700 €/mois',
					unité: '€/mois',
				}),
				rules
			)

			expect(result).toEqual([])
		})

		it('retourne les params qui ne correspondent à aucune règle', () => {
			const rules = ['salarie . contrat'] as Names[]

			const result = getRèglesIgnoréesFromSearchParams(
				new URLSearchParams({
					'salarie . contrat': 'CDD',
					'ancienne . règle . supprimée': 'oui',
					unité: '€/mois',
				}),
				rules
			)

			expect(result).toEqual(['ancienne . règle . supprimée'])
		})

		it('exclut les paramètres réservés (unité)', () => {
			const rules = [] as Names[]

			const result = getRèglesIgnoréesFromSearchParams(
				new URLSearchParams({ unité: '€/mois' }),
				rules
			)

			expect(result).toEqual([])
		})

		it('exclut les paramètres injectés par le script iframe (integratorUrl, lang, couleur)', () => {
			const rules = [] as Names[]

			const result = getRèglesIgnoréesFromSearchParams(
				new URLSearchParams({
					integratorUrl: 'https%3A%2F%2Fexemple.fr%2Fpage',
					lang: 'fr',
					couleur: '%7B%22h%22%3A210%2C%22s%22%3A100%2C%22l%22%3A31%7D',
				}),
				rules
			)

			expect(result).toEqual([])
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
