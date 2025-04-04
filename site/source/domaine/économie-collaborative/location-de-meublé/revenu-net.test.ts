import { Either, Equal, pipe } from 'effect'
import { describe, expect, it } from 'vitest'

import { SEUIL_PROFESSIONNALISATION } from '@/domaine/économie-collaborative/location-de-meublé/constantes'
import { calculeCotisations } from '@/domaine/économie-collaborative/location-de-meublé/cotisations'
import { eurosParAn, moins } from '@/domaine/Montant'

import { calculeRevenuNet } from './revenu-net'
import { SituationLocationCourteDuree } from './situation'

describe('calculeRevenuNet', () => {
	it('devrait correctement calculer le revenu net avec Either', () => {
		const recettes = eurosParAn(30_000)
		const situation: SituationLocationCourteDuree = {
			recettes,
			regimeCotisation: 'régime-général',
			estAlsaceMoselle: false,
			premièreAnnée: false,
		}

		const resultat = calculeRevenuNet(situation)
		expect(Either.isRight(resultat)).toBe(true)

		if (Either.isRight(resultat)) {
			const cotisationsResultat = calculeCotisations(situation)
			if (Either.isRight(cotisationsResultat)) {
				const revenuNetAttendu = pipe(
					recettes,
					moins(cotisationsResultat.right)
				)
				expect(Equal.equals(resultat.right, revenuNetAttendu)).toBe(true)
			}
		}
	})

	it("devrait propager l'erreur si les cotisations ne peuvent pas être calculées", () => {
		const situation: SituationLocationCourteDuree = {
			recettes: pipe(SEUIL_PROFESSIONNALISATION, moins(eurosParAn(1))),
			regimeCotisation: 'régime-général',
		}

		const resultat = calculeRevenuNet(situation)
		expect(Either.isLeft(resultat)).toBe(true)
	})
})
