import { Option, pipe } from 'effect'
import { describe, expect, it } from 'vitest'

import { eurosParAn, moins, plus } from '@/domaine/Montant'

import { estActiviteProfessionnelle } from './estActiviteProfessionnelle'
import { SituationÉconomieCollaborativeValide } from './situation'

const SEUIL_MEUBLÉ = eurosParAn(23_000)
// const SEUIL_CHAMBRE_HÔTE = eurosParAn(6_028)

describe('estActiviteProfessionnelle', () => {
	it('est faux si les recettes sont inférieures au seuil de professionalisation', () => {
		const situation: SituationÉconomieCollaborativeValide = {
			_tag: 'Situation',
			typeLocation: Option.none(),
			recettes: Option.some(
				pipe(SEUIL_MEUBLÉ, moins(eurosParAn(1)))
			) as Option.Some<typeof SEUIL_MEUBLÉ>,
			autresRevenus: Option.none(),
			typeDurée: Option.none(),
			estAlsaceMoselle: Option.none(),
			premièreAnnée: Option.none(),
		}

		expect(estActiviteProfessionnelle(situation)).toBe(false)
	})

	it('est vrai si les recettes sont égales au seuil de professionalisation', () => {
		const situation: SituationÉconomieCollaborativeValide = {
			_tag: 'Situation',
			typeLocation: Option.none(),
			recettes: Option.some(SEUIL_MEUBLÉ) as Option.Some<typeof SEUIL_MEUBLÉ>,
			autresRevenus: Option.none(),
			typeDurée: Option.none(),
			estAlsaceMoselle: Option.none(),
			premièreAnnée: Option.none(),
		}

		expect(estActiviteProfessionnelle(situation)).toBe(true)
	})

	it('est vrai si les recettes sont supérieures au seuil de professionalisation', () => {
		const situation: SituationÉconomieCollaborativeValide = {
			_tag: 'Situation',
			typeLocation: Option.none(),
			recettes: Option.some(
				pipe(SEUIL_MEUBLÉ, plus(eurosParAn(1)))
			) as Option.Some<typeof SEUIL_MEUBLÉ>,
			autresRevenus: Option.none(),
			typeDurée: Option.none(),
			estAlsaceMoselle: Option.none(),
			premièreAnnée: Option.none(),
		}

		expect(estActiviteProfessionnelle(situation)).toBe(true)
	})
})
