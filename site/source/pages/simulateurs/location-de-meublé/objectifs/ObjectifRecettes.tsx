import * as O from 'effect/Option'
import { useDispatch } from 'react-redux'

import { ObjectifSaisissableDeSimulation } from '@/components/Simulation/ObjectifSaisissableDeSimulation'
import { useEconomieCollaborative } from '@/contextes/économie-collaborative/store/useEconomieCollaborative.hook'
import MontantField from '@/design-system/conversation/MontantField'
import { eurosParAn, Montant } from '@/domaine/Montant'
import { ChangeHandler } from '@/utils/ChangeHandler'

export const ObjectifRecettes = () => {
	const dispatch = useDispatch()
	const { ready, situation, setSituation } = useEconomieCollaborative()

	if (!ready) return null

	return (
		<ObjectifSaisissableDeSimulation
			id="économie-collaborative-recettes"
			titre="Titre"
			valeur={O.some(eurosParAn(0))}
			rendreChampSaisie={() => (
				<RecettesInput
					montant={situation.recettes}
					onChange={(montant) =>
						dispatch(setSituation({ ...situation, recettes: montant }))
					}
				/>
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
		onChange={(montant) => onChange(O.fromNullable(montant))}
	/>
)
