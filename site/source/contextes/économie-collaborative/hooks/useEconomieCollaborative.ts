import { Option } from 'effect'

import { Montant } from '@/domaine/Montant'

import {
	Classement,
	initialSituationChambreDHôte,
	initialSituationMeubléDeTourisme,
	setTypeDurée,
	SituationÉconomieCollaborative,
	TypeDurée,
	TypeHébergement,
} from '../domaine/location-de-meublé/situation'
import { useSituationContext } from './ÉconomieCollaborativeContext'

export const useEconomieCollaborative = () => {
	const { situation, updateSituation } = useSituationContext()

	const set = {
		typeHébergement: (typeHébergement: TypeHébergement) => {
			const nouvelleSituation: SituationÉconomieCollaborative =
				typeHébergement === 'meublé-tourisme'
					? initialSituationMeubléDeTourisme
					: initialSituationChambreDHôte

			updateSituation(() => nouvelleSituation)
		},

		recettes: (recettes: Option.Option<Montant<'€/an'>>) => {
			updateSituation((prev) => {
				if (prev.typeHébergement === 'meublé-tourisme') {
					return { ...prev, recettes }
				}

				return prev
			})
		},

		revenuNet: (revenuNet: Option.Option<Montant<'€/an'>>) => {
			updateSituation((prev) => {
				if (prev.typeHébergement === 'chambre-hôte') {
					return { ...prev, revenuNet }
				}

				return prev
			})
		},

		recettesCourteDurée: (
			recettesCourteDurée: Option.Option<Montant<'€/an'>>
		) => {
			updateSituation((prev) => {
				if (
					prev.typeHébergement === 'meublé-tourisme' &&
					Option.isSome(prev.typeDurée) &&
					prev.typeDurée.value !== 'longue'
				) {
					return { ...prev, recettesCourteDurée }
				}

				return prev
			})
		},

		autresRevenus: (autresRevenus: Option.Option<Montant<'€/an'>>) => {
			updateSituation((prev) => {
				if (prev.typeHébergement === 'meublé-tourisme') {
					return { ...prev, autresRevenus }
				}

				return prev
			})
		},

		typeDurée: (typeDurée: Option.Option<TypeDurée>) => {
			updateSituation((prev) => {
				if (prev.typeHébergement === 'meublé-tourisme') {
					return setTypeDurée(typeDurée)(prev)
				}

				return prev
			})
		},

		classement: (classement: Option.Option<Classement>) => {
			updateSituation((prev) => {
				if (prev.typeHébergement === 'meublé-tourisme') {
					return { ...prev, classement }
				}

				return prev
			})
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
			updateSituation(() => initialSituationMeubléDeTourisme)
		},
	}

	return {
		situation,
		set,
	}
}
