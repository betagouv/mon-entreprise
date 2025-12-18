import * as O from 'effect/Option'
import { describe, expect, it } from 'vitest'

import {
	SituationMeubléDeTourismeIncomplète,
	SituationMeubléDuréeMixte,
	TypeDurée,
} from '@/contextes/économie-collaborative'
import { eurosParAn } from '@/domaine/Montant'

import { RecettesCourteDuréeQuestion } from './RecettesCourteDuréeQuestion'

describe('RecettesCourteDuréeQuestion', () => {
	describe('applicable', () => {
		it('doit être applicable pour activité secondaire (recettes < autres revenus) avec durée mixte', () => {
			const situation: SituationMeubléDuréeMixte = {
				_tag: 'Situation',
				_type: 'économie-collaborative',
				typeHébergement: 'meublé-tourisme',
				recettes: O.some(eurosParAn(50000)),
				autresRevenus: O.some(eurosParAn(100000)),
				typeDurée: O.some('mixte') as O.Some<'mixte'>,
				classement: O.none(),
				estAlsaceMoselle: O.none(),
				premièreAnnée: O.none(),
				recettesCourteDurée: O.none(),
			}

			expect(RecettesCourteDuréeQuestion.applicable(situation)).toBe(true)
		})

		it('ne doit PAS être applicable pour activité principale (recettes >= autres revenus)', () => {
			const situation: SituationMeubléDuréeMixte = {
				_tag: 'Situation',
				_type: 'économie-collaborative',
				typeHébergement: 'meublé-tourisme',
				recettes: O.some(eurosParAn(50000)),
				autresRevenus: O.some(eurosParAn(30000)),
				typeDurée: O.some('mixte') as O.Some<'mixte'>,
				classement: O.none(),
				estAlsaceMoselle: O.none(),
				premièreAnnée: O.none(),
				recettesCourteDurée: O.none(),
			}

			expect(RecettesCourteDuréeQuestion.applicable(situation)).toBe(false)
		})

		it('ne doit PAS être applicable si typeDurée non renseigné', () => {
			const situation: SituationMeubléDeTourismeIncomplète = {
				_tag: 'Situation',
				_type: 'économie-collaborative',
				typeHébergement: 'meublé-tourisme',
				recettes: O.some(eurosParAn(50000)),
				autresRevenus: O.some(eurosParAn(100000)),
				typeDurée: O.none() as O.None<TypeDurée>,
				classement: O.none(),
				estAlsaceMoselle: O.none(),
				premièreAnnée: O.none(),
			}

			expect(RecettesCourteDuréeQuestion.applicable(situation)).toBe(false)
		})

		it('ne doit PAS être applicable si autres revenus non renseignés', () => {
			const situation: SituationMeubléDuréeMixte = {
				_tag: 'Situation',
				_type: 'économie-collaborative',
				typeHébergement: 'meublé-tourisme',
				recettes: O.some(eurosParAn(50000)),
				autresRevenus: O.none(),
				typeDurée: O.some('mixte') as O.Some<'mixte'>,
				classement: O.none(),
				estAlsaceMoselle: O.none(),
				premièreAnnée: O.none(),
				recettesCourteDurée: O.none(),
			}

			expect(RecettesCourteDuréeQuestion.applicable(situation)).toBe(false)
		})
	})
})
