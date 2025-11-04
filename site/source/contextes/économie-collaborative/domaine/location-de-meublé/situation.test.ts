import { Option } from 'effect'
import { describe, expectTypeOf, it } from 'vitest'

import { eurosParAn, Montant } from '@/domaine/Montant'

import {
	SituationÉconomieCollaborative,
	SituationÉconomieCollaborativeValide,
} from './situation'

describe('SituationLocationCourteDuree', () => {
	it('accepte les situations valides', () => {
		const situationComplete: SituationÉconomieCollaborativeValide = {
			autresRevenus: Option.none(),
			typeDurée: Option.none(),
			_tag: 'Situation',
			typeLocation: Option.none(),
			_type: 'économie-collaborative',
			recettes: Option.some(eurosParAn(25_000)) as Option.Some<Montant<'€/an'>>,
			estAlsaceMoselle: Option.none(),
			premièreAnnée: Option.none(),
		}

		const situationPartielle: SituationÉconomieCollaborativeValide = {
			autresRevenus: Option.none(),
			typeDurée: Option.none(),
			_tag: 'Situation',
			typeLocation: Option.none(),
			_type: 'économie-collaborative',
			recettes: Option.some(eurosParAn(15_000)) as Option.Some<Montant<'€/an'>>,
			estAlsaceMoselle: Option.none(),
			premièreAnnée: Option.none(),
		}

		expectTypeOf(
			situationComplete
		).toMatchTypeOf<SituationÉconomieCollaborative>()
		expectTypeOf(
			situationPartielle
		).toMatchTypeOf<SituationÉconomieCollaborative>()

		// Vérifie que ces situations sont aussi conformes au type avec recettes définies
		expectTypeOf(
			situationComplete
		).toMatchTypeOf<SituationÉconomieCollaborativeValide>()
		expectTypeOf(
			situationPartielle
		).toMatchTypeOf<SituationÉconomieCollaborativeValide>()
	})

	it('rejette les situations invalides', () => {
		expectTypeOf({
			recettes: 'autre',
		}).not.toMatchTypeOf<SituationÉconomieCollaborative>()
	})
})
