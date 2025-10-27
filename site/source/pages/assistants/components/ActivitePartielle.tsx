import { Trans, useTranslation } from 'react-i18next'

import { Card, Emoji } from '@/design-system'
import { useSitePaths } from '@/sitePaths'

export function ActivitePartielleCard() {
	const { t } = useTranslation()
	const { absoluteSitePaths } = useSitePaths()

	return (
		<Card
			title={t('gérer.choix.chomage-partiel.title', 'Activité partielle')}
			icon={<Emoji emoji="🕟" />}
			to={absoluteSitePaths.simulateurs['activité-partielle']}
			ctaLabel={t('gérer.choix.chomage-partiel.cta', 'Voir le simulateur')}
		>
			<Trans i18nKey="gérer.choix.chomage-partiel.body">
				Calculez le reste à payer après remboursement de l'État lorsque vous
				activez le dispositif pour un employé.
			</Trans>
		</Card>
	)
}
