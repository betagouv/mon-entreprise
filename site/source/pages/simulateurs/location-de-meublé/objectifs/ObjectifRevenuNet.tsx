import { Option } from 'effect'
import { useTranslation } from 'react-i18next'

import { ObjectifDeSimulation } from '@/components/Simulation/ObjectifDeSimulation'
import { Montant } from '@/domaine/Montant'

export function ObjectifRevenuNet({
	revenuNet,
}: {
	revenuNet: Montant<'€/an'>
}) {
	const { t } = useTranslation()

	return (
		<ObjectifDeSimulation
			id="objectif-location-meuble-revenu-net"
			titre={t(
				'pages.simulateurs.location-de-logement-meublé.objectifs.revenu-net',
				'Revenu net'
			)}
			valeur={Option.some(revenuNet)}
			isInfoMode
			small
		/>
	)
}
