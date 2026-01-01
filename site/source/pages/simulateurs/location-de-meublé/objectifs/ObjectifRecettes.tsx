import * as O from 'effect/Option'

import {
	ChampSaisieProps,
	ObjectifSaisissableDeSimulation,
} from '@/components/Simulation/ObjectifSaisissableDeSimulation'
import { useEconomieCollaborative } from '@/contextes/économie-collaborative'
import { MontantField } from '@/design-system'
import { Montant } from '@/domaine/Montant'

export const ObjectifRecettes = () => {
	const { situation, set } = useEconomieCollaborative()

	return (
		<ObjectifSaisissableDeSimulation
			id="économie-collaborative-recettes"
			titre="Titre"
			valeur={situation.recettes as O.Option<Montant>}
			onChange={set.recettes as (valeur: O.Option<Montant>) => void}
			ChampSaisie={RecettesInput}
		/>
	)
}

const RecettesInput = ({ id, aria, valeur, onChange }: ChampSaisieProps) => (
	<MontantField
		id={id}
		aria={aria}
		value={O.getOrUndefined(valeur) as Montant<'€/an'> | undefined}
		unité="€/an"
		onChange={(montant: Montant<'€/an'> | undefined) =>
			onChange(O.fromNullable(montant) as O.Option<Montant>)
		}
	/>
)
