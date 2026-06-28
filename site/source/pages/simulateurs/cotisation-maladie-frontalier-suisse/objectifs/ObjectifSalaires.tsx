import * as O from 'effect/Option'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import {
	ChampSaisieProps,
	ObjectifSaisissableDeSimulation,
} from '@/components/Simulation/ObjectifSaisissableDeSimulation'
import { useFrontalierSuisse } from '@/contextes/frontalier-suisse'
import { MontantField } from '@/design-system'

export const ObjectifSalaires = () => {
	const { situation, set, annéeRevenus } = useFrontalierSuisse()
	const { t } = useTranslation()

	const ChampMontant = useCallback(
		({ id, aria }: ChampSaisieProps) => (
			<MontantField
				id={id}
				aria={aria}
				value={O.getOrUndefined(situation.salaires)}
				unité="€/an"
				onChange={(montant) => set.salaires(O.fromNullable(montant))}
			/>
		),
		[situation.salaires, set]
	)

	return (
		<ObjectifSaisissableDeSimulation
			id="frontalier-suisse-salaires"
			titre={t(
				'pages.simulateurs.cotisation-maladie-frontalier-suisse.objectifs.salaires',
				'Salaires perçus en {{annéeRevenus}}',
				{ annéeRevenus }
			)}
			valeur={situation.salaires}
			rendreChampSaisie={ChampMontant}
		/>
	)
}
