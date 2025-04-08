import { Either, Equal, Option, pipe } from 'effect'
import { describe, expect, it } from 'vitest'

import { SEUIL_PROFESSIONNALISATION } from '@/domaine/économie-collaborative/location-de-meublé/constantes'
import { calculeCotisations } from '@/domaine/économie-collaborative/location-de-meublé/cotisations'
import { EuroParAn, eurosParAn, moins } from '@/domaine/Montant'

import { calculeRevenuNet } from './revenu-net'
import { SituationLocationCourteDureeValide } from './situation'

describe('calculeRevenuNet', () => {
	it('devrait correctement calculer le revenu net avec Either', () => {
		const recettes = eurosParAn(30_000)
		const situation: SituationLocationCourteDureeValide = {
			recettes: Option.some(recettes) as Option.Some<EuroParAn>,
			regimeCotisation: Option.some('régime-général'),
			estAlsaceMoselle: Option.some(false),
			premièreAnnée: Option.some(false),
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
		const recettesInferieures = pipe(
			SEUIL_PROFESSIONNALISATION,
			moins(eurosParAn(1))
		)
		const situation: SituationLocationCourteDureeValide = {
			recettes: Option.some(recettesInferieures) as Option.Some<EuroParAn>,
			regimeCotisation: Option.some('régime-général'),
			estAlsaceMoselle: Option.none(),
			premièreAnnée: Option.none(),
		}

		const resultat = calculeRevenuNet(situation)
		expect(Either.isLeft(resultat)).toBe(true)
	})
})
