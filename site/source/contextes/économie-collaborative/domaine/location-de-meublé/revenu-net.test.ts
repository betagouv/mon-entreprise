import { Either, Equal, Option, pipe } from 'effect'
import { describe, expect, it } from 'vitest'

import { eurosParAn, moins, Montant } from '@/domaine/Montant'

import { calculeCotisations } from './cotisations'
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
			typeLocation: Option.none(),
			_type: 'économie-collaborative',
			recettes: Option.some(recettes) as Option.Some<Montant<'€/an'>>,
			estAlsaceMoselle: Option.some(false),
			premièreAnnée: Option.some(false),
		}

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
