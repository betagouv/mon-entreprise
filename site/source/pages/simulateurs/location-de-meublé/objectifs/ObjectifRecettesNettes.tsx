import * as O from 'effect/Option'
import { useTranslation } from 'react-i18next'

import { ObjectifSaisissableDeSimulation } from '@/components/Simulation/ObjectifSaisissableDeSimulation'
import { useEconomieCollaborative } from '@/contextes/économie-collaborative'
import { MontantField } from '@/design-system'
import { eurosParAn, Montant } from '@/domaine/Montant'
import { ChangeHandler } from '@/utils/ChangeHandler'

export const ObjectifRecettesNettes = () => {
	const { situation, set } = useEconomieCollaborative()
	const { t } = useTranslation()

	if (situation.typeHébergement !== 'chambre-hôte') {
		return null
	}

	return (
		<ObjectifSaisissableDeSimulation
			id="économie-collaborative-recettes-nettes"
			titre={t(
				'pages.simulateurs.location-de-logement-meublé.objectifs.recettes-nettes.titre',
				'Recettes nettes'
			)}
			valeur={O.some(eurosParAn(0))}
			rendreChampSaisie={() => (
				<RecettesNettesInput
					montant={situation.revenuNet}
					onChange={set.revenuNet}
				/>
			)}
		/>
	)
}

const RecettesNettesInput = ({
	montant,
	onChange,
}: {
	montant: O.Option<Montant<'€/an'>>
	onChange: ChangeHandler<O.Option<Montant<'€/an'>>>
}) => {
	const { t } = useTranslation()

	return (
		<MontantField
			value={O.getOrUndefined(montant)}
			unité="€/an"
			onChange={(montant: Montant<'€/an'> | undefined) =>
				onChange(O.fromNullable(montant))
			}
			aria={{
				label: t(
					'pages.simulateurs.location-de-logement-meublé.objectifs.recettes-nettes.aria-label',
					'Montant des recettes nettes'
				),
			}}
		/>
	)
}
