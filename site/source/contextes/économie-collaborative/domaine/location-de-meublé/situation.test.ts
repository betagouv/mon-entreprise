import { describe, expectTypeOf, it } from 'vitest'

import {
	SituationÉconomieCollaborative,
	SituationÉconomieCollaborativeValide,
} from './situation'
import { situationMeubléDeTourismeBuilder } from './test/situationBuilder'

describe('SituationLocationCourteDuree', () => {
	it('accepte les situations valides', () => {
		const situationComplete = situationMeubléDeTourismeBuilder()
			.avecRecettes(25_000)
			.build()

		expectTypeOf(
			situationComplete
		).toMatchTypeOf<SituationÉconomieCollaborative>()

		expectTypeOf(
			situationComplete
		).toMatchTypeOf<SituationÉconomieCollaborativeValide>()
	})

	it('rejette les situations invalides', () => {
		expectTypeOf({
			recettes: 'autre',
		}).not.toMatchTypeOf<SituationÉconomieCollaborative>()
	})
})
