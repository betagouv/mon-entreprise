import { Option } from 'effect'

import { Montant } from '@/domaine/Montant'

import {
	initialSituationÉconomieCollaborative,
	SituationÉconomieCollaborative,
	TypeDurée,
	TypeLocation,
} from '../domaine/location-de-meublé/situation'
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

		autresRevenus: (autresRevenus: Option.Option<Montant<'€/an'>>) => {
			updateSituation((prev) => ({ ...prev, autresRevenus }))
		},

		typeDurée: (typeDurée: Option.Option<TypeDurée>) => {
			updateSituation((prev) => ({ ...prev, typeDurée }))
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
