import { Option } from 'effect'
import { useTranslation } from 'react-i18next'

import { ObjectifDeSimulation } from '@/components/Simulation/ObjectifDeSimulation'
import { EuroParAn } from '@/domaine/Montant'

export function ObjectifCotisations({
	cotisations,
}: {
	cotisations: EuroParAn
}) {
	const { t } = useTranslation()

	return (
		<ObjectifDeSimulation
			id="objectif-location-meuble-cotisations"
			titre={t(
				'pages.simulateurs.location-de-logement-meublé.objectifs.cotisations',
				'Cotisations sociales'
			)}
			valeur={Option.some(cotisations)}
			isInfoMode
			small
		/>
	)
}
