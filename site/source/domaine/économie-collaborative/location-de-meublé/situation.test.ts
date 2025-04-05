import { describe, expectTypeOf, it } from 'vitest'

import { eurosParAn } from '@/domaine/Montant'

import { SituationLocationCourteDuree } from './situation'

describe('SituationLocationCourteDuree', () => {
	it('accepte les situations valides', () => {
		const situationComplete: SituationLocationCourteDuree = {
			recettes: eurosParAn(25_000),
			regimeCotisation: 'micro-entreprise',
		}

		const situationPartielle: SituationLocationCourteDuree = {
			recettes: eurosParAn(15_000),
		}

		expectTypeOf(
			situationComplete
		).toMatchTypeOf<SituationLocationCourteDuree>()
		expectTypeOf(
			situationPartielle
		).toMatchTypeOf<SituationLocationCourteDuree>()
	})

	it('rejette les situations invalides', () => {
		expectTypeOf({
			recettes: 'autre',
		}).not.toMatchTypeOf<SituationLocationCourteDuree>()
	})
})
