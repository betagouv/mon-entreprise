import { Option, pipe } from 'effect'
import { describe, expect, it } from 'vitest'

import { estActiviteProfessionnelle } from '@/contextes/économie-collaborative/domaine/location-de-meublé/activite'
import { eurosParAn, moins, plus } from '@/domaine/Montant'

import { SEUIL_PROFESSIONNALISATION } from './constantes'
import {
	SITUATION_ÉCONOMIE_COLLABORATIVE,
	SituationÉconomieCollaborativeValide,
} from './situation'

describe('estActiviteProfessionnelle', () => {
	it('est faux si les recettes sont inférieures au seuil de professionalisation', () => {
		const situation: SituationÉconomieCollaborativeValide = {
			_tag: 'Situation',
			_type: SITUATION_ÉCONOMIE_COLLABORATIVE,
			recettes: Option.some(
				pipe(SEUIL_PROFESSIONNALISATION, moins(eurosParAn(1)))
			) as Option.Some<typeof SEUIL_PROFESSIONNALISATION>,
			regimeCotisation: Option.none(),
			estAlsaceMoselle: Option.none(),
			premièreAnnée: Option.none(),
		}

		expect(estActiviteProfessionnelle(situation)).toBe(false)
	})

	it('est vrai si les recettes sont égales au seuil de professionalisation', () => {
		const situation: SituationÉconomieCollaborativeValide = {
			_tag: 'Situation',
			_type: SITUATION_ÉCONOMIE_COLLABORATIVE,
			recettes: Option.some(SEUIL_PROFESSIONNALISATION) as Option.Some<
				typeof SEUIL_PROFESSIONNALISATION
			>,
			regimeCotisation: Option.none(),
			estAlsaceMoselle: Option.none(),
			premièreAnnée: Option.none(),
		}

		expect(estActiviteProfessionnelle(situation)).toBe(true)
	})

	it('est vrai si les recettes sont supérieures au seuil de professionalisation', () => {
		const situation: SituationÉconomieCollaborativeValide = {
			_tag: 'Situation',
			_type: SITUATION_ÉCONOMIE_COLLABORATIVE,
			recettes: Option.some(
				pipe(SEUIL_PROFESSIONNALISATION, plus(eurosParAn(1)))
			) as Option.Some<typeof SEUIL_PROFESSIONNALISATION>,
			regimeCotisation: Option.none(),
			estAlsaceMoselle: Option.none(),
			premièreAnnée: Option.none(),
		}

		expect(estActiviteProfessionnelle(situation)).toBe(true)
	})
})
