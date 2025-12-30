import { Either, Equal, pipe } from 'effect'
import { describe, expect, it } from 'vitest'

import { eurosParAn, moins } from '@/domaine/Montant'

import { calculeCotisations } from './cotisations'
import { calculeRevenuNet } from './revenu-net'
import { RegimeCotisation } from './situation'
import { situationMeubléDeTourismeBuilder } from './test/situationBuilder'

describe('calculeRevenuNet', () => {
	it('devrait correctement calculer le revenu net avec Either', () => {
		const recettes = eurosParAn(30_000)
		const situation = situationMeubléDeTourismeBuilder()
			.avecRecettes(recettes.valeur)
			.avecAlsaceMoselle(false)
			.avecPremièreAnnée(false)
			.build()

		const resultat = calculeRevenuNet(situation, RegimeCotisation.regimeGeneral)
		expect(Either.isRight(resultat)).toBe(true)

		if (Either.isRight(resultat)) {
			const cotisationsResultat = calculeCotisations(
				situation,
				RegimeCotisation.regimeGeneral
			)
			if (Either.isRight(cotisationsResultat)) {
				const revenuNetAttendu = pipe(
					recettes,
					moins(cotisationsResultat.right)
				)
				expect(Equal.equals(resultat.right, revenuNetAttendu)).toBe(true)
			}
		}
	})
})
