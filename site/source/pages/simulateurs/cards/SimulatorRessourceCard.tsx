import { Trans, useTranslation } from 'react-i18next'

import { Article, Emoji } from '@/design-system'
import { useNavigationOrigin } from '@/hooks/useNavigationOrigin'
import useSimulatorsData from '@/hooks/useSimulatorsData'
import { SimulatorData } from '@/pages/simulateurs-et-assistants/metadata-src'

type SimulatorRessourceCardProps = {
	simulatorId: keyof SimulatorData
}

export function SimulatorRessourceCard({
	simulatorId,
}: SimulatorRessourceCardProps) {
	const simulator = useSimulatorsData()[simulatorId]
	const { t } = useTranslation()
	const [, setNavigationOrigin] = useNavigationOrigin()

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
			aria-label={
				simulator.shortName +
				', ' +
				t('cards.simulator-resource.cta', 'Accéder au simulateur')
			}
			to={{ pathname: simulator.path }}
			onPress={() => setNavigationOrigin({ fromSimulateurs: true })}
		>
			{simulator.meta?.description}
		</Article>
	)
}
