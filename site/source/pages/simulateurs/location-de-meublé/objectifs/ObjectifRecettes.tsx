import * as O from 'effect/Option'

import { ObjectifSaisissableDeSimulation } from '@/components/Simulation/ObjectifSaisissableDeSimulation'
import { useEconomieCollaborative } from '@/contextes/économie-collaborative/hooks/useEconomieCollaborative'
import { MontantField } from '@/design-system'
import { eurosParAn, Montant } from '@/domaine/Montant'
import { ChangeHandler } from '@/utils/ChangeHandler'

export const ObjectifRecettes = () => {
	const { situation, set } = useEconomieCollaborative()

	return (
		<ObjectifSaisissableDeSimulation
			id="économie-collaborative-recettes"
			titre="Titre"
			valeur={O.some(eurosParAn(0))}
			rendreChampSaisie={() => (
				<RecettesInput montant={situation.recettes} onChange={set.recettes} />
			)}
		/>
	)
}

const RecettesInput = ({
	montant,
	onChange,
}: {
	montant: O.Option<Montant<'EuroParAn'>>
	onChange: ChangeHandler<O.Option<Montant<'EuroParAn'>>>
}) => (
	<MontantField
		value={O.getOrUndefined(montant)}
		unité="EuroParAn"
		onChange={(montant: Montant<'EuroParAn'> | undefined) =>
			onChange(O.fromNullable(montant))
		}
	/>
)
