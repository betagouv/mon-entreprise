import { Option } from 'effect'

import {
	SituationÉconomieCollaborative,
	TypeLocation,
} from '@/contextes/économie-collaborative/domaine/location-de-meublé'
import { initialSituationÉconomieCollaborative } from '@/contextes/économie-collaborative/domaine/location-de-meublé/situation'
import { Montant } from '@/domaine/Montant'

import { useSituationContext } from './ÉconomieCollaborativeContext'

export const useEconomieCollaborative = () => {
	const { situation, updateSituation } = useSituationContext()

	const set = {
		typeLocation: (typeLocation: Option.Option<TypeLocation>) => {
			updateSituation((prev) => ({ ...prev, typeLocation }))
		},

		recettes: (recettes: Option.Option<Montant<'€/an'>>) => {
			updateSituation((prev) => ({ ...prev, recettes }))
		},

		estAlsaceMoselle: (estAlsaceMoselle: Option.Option<boolean>) => {
			updateSituation((prev) => ({ ...prev, estAlsaceMoselle }))
		},

		premiereAnnee: (premièreAnnée: Option.Option<boolean>) => {
			updateSituation((prev) => ({ ...prev, premièreAnnée }))
		},

		situation: (situation: SituationÉconomieCollaborative) => {
			updateSituation(() => situation)
		},

		reset: () => {
			updateSituation(() => initialSituationÉconomieCollaborative)
		},
	}

	return {
		situation,
		set,
	}
}
