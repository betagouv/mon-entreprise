import Emoji from '@/components/utils/Emoji'
import { Card } from '@/design-system/card'
import { useSitePaths } from '@/sitePaths'
import { Trans, useTranslation } from 'react-i18next'

export function ActivitePartielleCard() {
	const { t } = useTranslation()
	const { absoluteSitePaths } = useSitePaths()

	return (
		<Card
			title={t('gérer.choix.chomage-partiel.title', 'Activité partielle')}
			icon={<Emoji emoji="🕟" />}
			to={absoluteSitePaths.simulateurs['chômage-partiel']}
			ctaLabel={t('gérer.choix.chomage-partiel.cta', 'Voir le simulateur')}
		>
			<Trans i18nKey="gérer.choix.chomage-partiel.body">
				Calculez le reste à payer après remboursement de l'État lorsque vous
				activez le dispositif pour un employé.
			</Trans>
		</Card>
	)
}
