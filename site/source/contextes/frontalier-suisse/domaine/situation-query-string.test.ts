import * as O from 'effect/Option'
import { describe, expect, it } from 'vitest'

import { eurosParAn } from '@/domaine/Montant'

import {
	initialSituationFrontalierSuisse,
	SituationFrontalierSuisse,
} from './situation'
import { decodeSituation, encodeSituation } from './situation-query-string'

const situationComplète: SituationFrontalierSuisse = {
	...initialSituationFrontalierSuisse,
	dateAffiliation: O.some(new Date(2026, 0, 15)),
	dateFinAffiliation: O.some(new Date(2026, 8, 30)),
	salaires: O.some(eurosParAn(50_000)),
	autresRevenus: O.some(eurosParAn(1_000)),
}

describe('encodeSituation / decodeSituation', () => {
	it('restitue la situation complète après un aller-retour', () => {
		expect(decodeSituation(encodeSituation(situationComplète))).toEqual(
			situationComplète
		)
	})

	it('restitue une situation partielle après un aller-retour', () => {
		const partielle: SituationFrontalierSuisse = {
			...initialSituationFrontalierSuisse,
			dateAffiliation: O.some(new Date(2026, 0, 15)),
		}

		expect(decodeSituation(encodeSituation(partielle))).toEqual(partielle)
	})

	it('produit une chaîne utilisable telle quelle dans une URL', () => {
		const chaîne = encodeSituation(situationComplète)

		expect(chaîne).toBe(encodeURIComponent(chaîne))
	})

	it('retourne la situation initiale pour une chaîne invalide', () => {
		expect(decodeSituation('n’importe quoi')).toEqual(
			initialSituationFrontalierSuisse
		)
	})

	it('ignore les champs mal formés', () => {
		const chaîne = Buffer.from(
			JSON.stringify({ dateAffiliation: 'pas-une-date', salaires: 'abc' })
		).toString('base64url')

		expect(decodeSituation(chaîne)).toEqual(initialSituationFrontalierSuisse)
	})
})
