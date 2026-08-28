import * as O from 'effect/Option'
import { describe, expect, it } from 'vitest'

import { eurosParAn } from '@/domaine/MontantRecurrent'

import { initialSituationComparée, SituationComparée } from './situation'
import { decodeSituation, encodeSituation } from './situationQueryString'

const situationComplète: SituationComparée = {
	...initialSituationComparée,
	chiffreDAffaires: O.some(eurosParAn(48_000)),
	charges: O.some(eurosParAn(12_000)),
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

	it('retourne la situation initiale pour une chaîne invalide', () => {
		expect(decodeSituation('n’importe quoi')).toEqual(initialSituationComparée)
	})

	it('ignore les champs mal formés', () => {
		const chaîne = Buffer.from(
			JSON.stringify({ chiffreDAffaires: 'pas-un-montant' })
		).toString('base64url')

		expect(decodeSituation(chaîne)).toEqual(initialSituationComparée)
	})
})
