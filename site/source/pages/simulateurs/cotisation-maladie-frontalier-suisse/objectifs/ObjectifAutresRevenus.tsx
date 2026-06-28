import * as O from 'effect/Option'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import {
	ChampSaisieProps,
	ObjectifSaisissableDeSimulation,
} from '@/components/Simulation/ObjectifSaisissableDeSimulation'
import { useFrontalierSuisse } from '@/contextes/frontalier-suisse'
import { MontantField } from '@/design-system'

export const ObjectifAutresRevenus = () => {
	const { situation, set, annéeRevenus } = useFrontalierSuisse()
	const { t } = useTranslation()

	const ChampMontant = useCallback(
		({ id, aria }: ChampSaisieProps) => (
			<MontantField
				id={id}
				aria={aria}
				value={O.getOrUndefined(situation.autresRevenus)}
				unité="€/an"
				onChange={(montant) => set.autresRevenus(O.fromNullable(montant))}
			/>
		),
		[situation.autresRevenus, set]
	)

	return (
		<ObjectifSaisissableDeSimulation
			id="frontalier-suisse-autres-revenus"
			titre={t(
				'pages.simulateurs.cotisation-maladie-frontalier-suisse.objectifs.autres-revenus',
				'Autres revenus perçus en {{annéeRevenus}}',
				{ annéeRevenus }
			)}
			valeur={situation.autresRevenus}
			rendreChampSaisie={ChampMontant}
		/>
	)
}
