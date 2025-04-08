import { Option } from 'effect'
import { describe, expectTypeOf, it } from 'vitest'

import { EuroParAn, eurosParAn } from '@/domaine/Montant'

import { SituationLocationCourteDuree, SituationLocationCourteDureeValide } from './situation'

describe('SituationLocationCourteDuree', () => {
	it('accepte les situations valides', () => {
		const situationComplete: SituationLocationCourteDureeValide = {
			recettes: Option.some(eurosParAn(25_000)) as Option.Some<EuroParAn>,
			regimeCotisation: Option.some('micro-entreprise'),
			estAlsaceMoselle: Option.none(),
			premièreAnnée: Option.none(),
		}

		const situationPartielle: SituationLocationCourteDureeValide = {
			recettes: Option.some(eurosParAn(15_000)) as Option.Some<EuroParAn>,
			regimeCotisation: Option.none(),
			estAlsaceMoselle: Option.none(),
			premièreAnnée: Option.none(),
		}

		expectTypeOf(
			situationComplete
		).toMatchTypeOf<SituationLocationCourteDuree>()
		expectTypeOf(
			situationPartielle
		).toMatchTypeOf<SituationLocationCourteDuree>()
		
		// Vérifie que ces situations sont aussi conformes au type avec recettes définies
		expectTypeOf(
			situationComplete
		).toMatchTypeOf<SituationLocationCourteDureeValide>()
		expectTypeOf(
			situationPartielle
		).toMatchTypeOf<SituationLocationCourteDureeValide>()
	})

	it('rejette les situations invalides', () => {
		expectTypeOf({
			recettes: 'autre',
		}).not.toMatchTypeOf<SituationLocationCourteDuree>()
	})
})