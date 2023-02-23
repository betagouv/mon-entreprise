import { Trans } from 'react-i18next'

import { Article } from '@/design-system/card'
import { Emoji } from '@/design-system/emoji'
import useSimulatorsData, { SimulatorData } from '@/hooks/useSimulatorsData'

type SimulatorRessourceCardProps = {
	simulatorId: keyof SimulatorData
}

export function SimulatorRessourceCard({
	simulatorId,
}: SimulatorRessourceCardProps) {
	const simulator = useSimulatorsData()[simulatorId]

	if (!simulator.path) {
		return null
	}

	return (
		<Article
			title={simulator.shortName}
			icon={simulator.icône && <Emoji emoji={simulator.icône} />}
			ctaLabel={
				<Trans i18nKey="cards.simulator-resource.cta">
					Accéder au simulateur
				</Trans>
			}
			to={{ pathname: simulator.path }}
			state={{ fromSimulateurs: true }}
		>
			{simulator.meta?.description}
		</Article>
	)
}
