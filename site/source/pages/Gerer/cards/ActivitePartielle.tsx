import Emoji from '@/components/utils/Emoji'
import { SitePathsContext } from '@/components/utils/SitePathsContext'
import { Card } from '@/design-system/card'
import { useContext } from 'react'
import { Trans, useTranslation } from 'react-i18next'

export function ActivitePartielleCard() {
	const { t } = useTranslation()
	const sitePaths = useContext(SitePathsContext)

	return (
		<Card
			title={t('gérer.choix.chomage-partiel.title', 'Activité partielle')}
			icon={<Emoji emoji="🕟" />}
			to={sitePaths.simulateurs['chômage-partiel']}
			ctaLabel={t('gérer.choix.chomage-partiel.cta', 'Voir le simulateur')}
		>
			<Trans i18nKey="gérer.choix.chomage-partiel.body">
				Calculez le reste à payer après remboursement de l'État lorsque vous
				activez le dispositif pour un employé.
			</Trans>
		</Card>
	)
}
