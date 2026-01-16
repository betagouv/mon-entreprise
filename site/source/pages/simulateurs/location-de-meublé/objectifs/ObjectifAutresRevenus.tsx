import * as O from 'effect/Option'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { ObjectifSaisissableDeSimulation } from '@/components/Simulation/ObjectifSaisissableDeSimulation'
import {
	estSituationMeubléDeTourismeValide,
	useEconomieCollaborative,
} from '@/contextes/économie-collaborative'
import { MontantField } from '@/design-system'
import { eurosParAn, Montant } from '@/domaine/Montant'

export const ObjectifAutresRevenus = () => {
	const { situation, set } = useEconomieCollaborative()
	const { t } = useTranslation()

	const handleChange = useCallback(
		(newValue: Montant<'€/an'> | undefined) => {
			if (newValue !== undefined) {
				set.autresRevenus(O.some(newValue))
			} else {
				set.autresRevenus(O.none())
			}
		},
		[set]
	)

	if (!estSituationMeubléDeTourismeValide(situation)) {
		return null
	}

	const autresRevenus = O.getOrUndefined(situation.autresRevenus)

	return (
		<ObjectifSaisissableDeSimulation
			id="économie-collaborative-autres-revenus"
			titre={t(
				'pages.simulateurs.location-de-logement-meublé.objectifs.autres-revenus.titre',
				'Autres revenus annuels'
			)}
			valeur={O.some(eurosParAn(0))}
			rendreChampSaisie={() => (
				<MontantField
					value={autresRevenus}
					onChange={handleChange}
					unité="€/an"
					label={t(
						'pages.simulateurs.location-de-logement-meublé.objectifs.autres-revenus.aria-label',
						'Montant des autres revenus annuels'
					)}
				/>
			)}
		/>
	)
}
