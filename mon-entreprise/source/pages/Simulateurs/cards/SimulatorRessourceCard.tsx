import Emoji from 'Components/utils/Emoji'
import { Card } from 'DesignSystem/card'
import { Body } from 'DesignSystem/typography/paragraphs'
import { useTranslation } from 'react-i18next'
import useSimulatorsData, { SimulatorData } from '../metadata'

type SimulatorRessourceCardProps = {
	simulatorId: keyof SimulatorData
}

export function SimulatorRessourceCard({
	simulatorId,
}: SimulatorRessourceCardProps) {
	const simulator = useSimulatorsData()[simulatorId]
	const { t } = useTranslation()

	if (!simulator.path) return null

	return (
		<Card
			title={simulator.shortName}
			icon={simulator.icône && <Emoji emoji={simulator.icône} />}
			callToAction={{
				to: {
					pathname: simulator.path,
					state: { fromSimulateurs: true },
				},
				label: t('cards.simulator-resource.cta', 'Accéder au simulateur'),
			}}
		>
			<Body>{simulator.meta?.description}</Body>
		</Card>
	)
}
