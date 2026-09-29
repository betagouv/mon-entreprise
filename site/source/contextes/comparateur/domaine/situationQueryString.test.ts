import * as O from 'effect/Option'
import { describe, expect, it } from 'vitest'

import { eurosParAn, eurosParMois } from '@/domaine/MontantRecurrent'
import { pourcentage, quantité } from '@/domaine/Quantite'
import { encodeSituationSérialisée } from '@/utils/URLs'

import { initialSituationComparée, SituationComparée } from './situation'
import { decodeSituation, encodeSituation } from './situationQueryString'

const situationComplète: SituationComparée = {
	...initialSituationComparée,
	chiffreDAffaires: O.some(eurosParAn(48_000)),
	charges: O.some(eurosParAn(12_000)),
	IRouIS: 'IR',
	versementLibératoire: true,
	natureActivité: 'artisanale',
	typeActivité: 'service',
	acre: true,
	méthodeImposition: 'taux personnalisé',
	tauxImposition: O.some(pourcentage(18)),
	situationFamiliale: 'couple',
	enfants: quantité(2, 'enfant'),
	autresRevenus: eurosParAn(77_000),
}

describe('encodeSituation / decodeSituation', () => {
	it('restitue la situation complète après un aller-retour', () => {
		expect(decodeSituation(encodeSituation(situationComplète))).toEqual(
			situationComplète
		)
	})

	it('restitue une situation partielle après un aller-retour', () => {
		const partielle: SituationComparée = {
			...initialSituationComparée,
			chiffreDAffaires: O.some(eurosParAn(48_000)),
		}

		expect(decodeSituation(encodeSituation(partielle))).toEqual(partielle)
	})

	it('produit une chaîne utilisable telle quelle dans une URL', () => {
		const chaîne = encodeSituation(situationComplète)

		expect(chaîne).toBe(encodeURIComponent(chaîne))
	})

	it('normalise les montants en €/an', () => {
		const mensuelle: SituationComparée = {
			...initialSituationComparée,
			chiffreDAffaires: O.some(eurosParMois(4_000)),
		}

		expect(decodeSituation(encodeSituation(mensuelle))).toEqual({
			...initialSituationComparée,
			chiffreDAffaires: O.some(eurosParAn(48_000)),
		})
	})

	it('n’encode que les champs différents de la situation initiale', () => {
		const partielle: SituationComparée = {
			...initialSituationComparée,
			chiffreDAffaires: O.some(eurosParAn(48_000)),
		}

		expect(encodeSituation(partielle)).toEqual(
			encodeSituationSérialisée({
				chiffreDAffaires: 48_000,
			})
		)
	})

	it('retourne la situation initiale pour une chaîne invalide', () => {
		expect(decodeSituation('n’importe quoi')).toEqual(initialSituationComparée)
	})

	it('ignore les champs mal formés', () => {
		const chaîne = Buffer.from(
			JSON.stringify({
				chiffreDAffaires: 'pas-un-montant',
				IRouIS: 'pas-une-imposition',
				versementLibératoire: 'pas-un-booléen',
				natureActivité: 'pas-une-activité',
				typeActivité: 'pas-un-type-d-activité',
				méthodeImposition: 'pas-une-méthode-d-imposition',
				situationFamiliale: 'pas-une-situation-familiale',
			})
		).toString('base64url')

		expect(decodeSituation(chaîne)).toEqual(initialSituationComparée)
	})

	it('retourne un taux d’imposition à 0 %', () => {
		const chaîne = Buffer.from(
			JSON.stringify({
				tauxImposition: 0,
			})
		).toString('base64url')

		expect(decodeSituation(chaîne)).toEqual({
			...initialSituationComparée,
			tauxImposition: O.some(pourcentage(0)),
		})
	})
})
