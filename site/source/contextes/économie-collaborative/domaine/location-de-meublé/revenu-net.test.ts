import { Either, Equal, Option, pipe } from 'effect'
import { describe, expect, it } from 'vitest'

import { SEUIL_PROFESSIONNALISATION } from '@/contextes/économie-collaborative/domaine/location-de-meublé/constantes'
import { calculeCotisations } from '@/contextes/économie-collaborative/domaine/location-de-meublé/cotisations'
import { eurosParAn, moins, Montant } from '@/domaine/Montant'

import { calculeRevenuNet } from './revenu-net'
import {
	RegimeCotisation,
	SituationÉconomieCollaborativeValide,
} from './situation'

describe('calculeRevenuNet', () => {
	it('devrait correctement calculer le revenu net avec Either', () => {
		const recettes = eurosParAn(30_000)
		const situation: SituationÉconomieCollaborativeValide = {
			_tag: 'Situation',
			_type: 'économie-collaborative',
			recettes: Option.some(recettes) as Option.Some<Montant<'€/an'>>,
			regimeCotisation: Option.some(RegimeCotisation.regimeGeneral),
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
		const situation: SituationÉconomieCollaborativeValide = {
			_tag: 'Situation',
			_type: 'économie-collaborative',
			recettes: Option.some(recettesInferieures) as Option.Some<
				Montant<'€/an'>
			>,
			regimeCotisation: Option.some(RegimeCotisation.regimeGeneral),
			estAlsaceMoselle: Option.none(),
			premièreAnnée: Option.none(),
		}

		const resultat = calculeRevenuNet(situation)
		expect(Either.isLeft(resultat)).toBe(true)
	})
})
