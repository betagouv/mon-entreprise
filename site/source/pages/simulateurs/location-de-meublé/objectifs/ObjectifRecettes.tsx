import * as O from 'effect/Option'
import { useCallback } from 'react'

import {
	ChampSaisieProps,
	ObjectifSaisissableDeSimulation,
} from '@/components/Simulation/ObjectifSaisissableDeSimulation'
import { useEconomieCollaborative } from '@/contextes/économie-collaborative'
import { MontantField } from '@/design-system'
import { Montant } from '@/domaine/Montant'

export const ObjectifRecettes = () => {
	const { situation, set } = useEconomieCollaborative()

	const valeur = situation.recettes
	const handleChange = useCallback(
		(valeur: O.Option<Montant<'€/an'>>) => set.recettes(valeur),
		[set]
	)

	const RecettesInput = useCallback(
		({ id, aria }: ChampSaisieProps) => (
			<MontantField
				id={id}
				aria={aria}
				value={O.getOrUndefined(valeur)}
				unité="€/an"
				onChange={(montant: Montant<'€/an'> | undefined) =>
					handleChange(O.fromNullable(montant))
				}
			/>
		),
		[handleChange, valeur]
	)

	return (
		<ObjectifSaisissableDeSimulation
			id="économie-collaborative-recettes"
			titre="Titre"
			valeur={valeur}
			rendreChampSaisie={RecettesInput}
		/>
	)
}
