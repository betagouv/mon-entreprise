import { Either, Option } from 'effect'

import {
	calculeCotisations,
	RegimeCotisation,
	SituationÉconomieCollaborative,
	TypeLocation,
} from '@/contextes/économie-collaborative/domaine/location-de-meublé'
import { SituationIncomplète } from '@/contextes/économie-collaborative/domaine/location-de-meublé/erreurs'
import { calculeRevenuNet } from '@/contextes/économie-collaborative/domaine/location-de-meublé/revenu-net'
import {
	estSituationValide,
	initialSituationÉconomieCollaborative,
} from '@/contextes/économie-collaborative/domaine/location-de-meublé/situation'
import { Montant } from '@/domaine/Montant'

import { useSituationContext } from './ÉconomieCollaborativeContext'

export const useEconomieCollaborative = () => {
	const { situation, updateSituation } = useSituationContext()

	const cotisations = calculeCotisations(situation)
	const revenuNet = estSituationValide(situation)
		? calculeRevenuNet(situation)
		: Either.left(
				new SituationIncomplète({
					message:
						'Impossible de calculer le revenu net sans connaitre les recettes',
				})
		  )

	const set = {
		typeLocation: (typeLocation: Option.Option<TypeLocation>) => {
			updateSituation((prev) => ({ ...prev, typeLocation }))
		},

		recettes: (recettes: Option.Option<Montant<'€/an'>>) => {
			updateSituation((prev) => ({ ...prev, recettes }))
		},

		regimeCotisation: (regimeCotisation: Option.Option<RegimeCotisation>) => {
			updateSituation((prev) => ({ ...prev, regimeCotisation }))
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
		cotisations,
		revenuNet,
		set,
	}
}
