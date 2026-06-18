import * as O from 'effect/Option'
import { ReactNode, useCallback } from 'react'

import {
	ChampSaisieProps,
	ObjectifSaisissableDeSimulation,
} from '@/components/Simulation/ObjectifSaisissableDeSimulation'
import { MontantField } from '@/design-system'
import { Montant } from '@/domaine/Montant'

export const ObjectifRevenuAnnuel = ({
	id,
	titre,
	valeur,
	onChange,
}: {
	id: string
	titre: ReactNode
	valeur: O.Option<Montant<'€/an'>>
	onChange: (valeur: O.Option<Montant<'€/an'>>) => void
}) => {
	const ChampMontant = useCallback(
		({ id: champId, aria }: ChampSaisieProps) => (
			<MontantField
				id={champId}
				aria={aria}
				value={O.getOrUndefined(valeur)}
				unité="€/an"
				onChange={(montant) => onChange(O.fromNullable(montant))}
			/>
		),
		[onChange, valeur]
	)

	return (
		<ObjectifSaisissableDeSimulation
			id={id}
			titre={titre}
			valeur={valeur}
			rendreChampSaisie={ChampMontant}
		/>
	)
}
