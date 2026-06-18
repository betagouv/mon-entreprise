import * as O from 'effect/Option'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import {
	ChampSaisieProps,
	ObjectifSaisissableDeSimulation,
} from '@/components/Simulation/ObjectifSaisissableDeSimulation'
import { useFrontalierSuisse } from '@/contextes/frontalier-suisse'
import { DateField } from '@/design-system'

export const ObjectifDateAffiliation = () => {
	const { situation, set } = useFrontalierSuisse()
	const { t } = useTranslation()

	const handleChange = useCallback(
		(date: Date | undefined) => set.dateAffiliation(O.fromNullable(date)),
		[set]
	)

	const ChampDate = useCallback(
		({ id, aria }: ChampSaisieProps) => (
			<DateField
				id={id}
				aria-labelledby={aria.labelledby}
				defaultSelected={O.getOrUndefined(situation.dateAffiliation)}
				onChange={handleChange}
			/>
		),
		[handleChange, situation.dateAffiliation]
	)

	return (
		<ConteneurAuDessus>
			<ObjectifSaisissableDeSimulation
				id="frontalier-suisse-date-affiliation"
				titre={t(
					'pages.simulateurs.cotisation-maladie-frontalier-suisse.objectifs.date-affiliation',
					"Date d'affiliation"
				)}
				valeur={O.none()}
				rendreChampSaisie={ChampDate}
			/>
		</ConteneurAuDessus>
	)
}

const ConteneurAuDessus = styled.div`
	position: relative;
	z-index: 2;
`
