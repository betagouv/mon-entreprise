import * as O from 'effect/Option'
import { useCallback } from 'react'

import { ObjectifSaisissableDeSimulation } from '@/components/Simulation/ObjectifSaisissableDeSimulation'
import { useEconomieCollaborative } from '@/contextes/économie-collaborative'
import { MontantField } from '@/design-system'
import { eurosParAn, Montant } from '@/domaine/Montant'

export const ObjectifAutresRevenus = () => {
	const { situation, set } = useEconomieCollaborative()

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

	const autresRevenus = O.getOrUndefined(situation.autresRevenus)

	return (
		<ObjectifSaisissableDeSimulation
			id="économie-collaborative-autres-revenus"
			titre="Autres revenus"
			valeur={O.some(eurosParAn(0))}
			rendreChampSaisie={() => (
				<MontantField
					value={autresRevenus}
					onChange={handleChange}
					unité="€/an"
				/>
			)}
		/>
	)
}
