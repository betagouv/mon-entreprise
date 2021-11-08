import Emoji from 'Components/utils/Emoji'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { Card } from 'DesignSystem/card'
import { Body } from 'DesignSystem/typography/paragraphs'
import { useContext } from 'react'
import { Trans, useTranslation } from 'react-i18next'

export function ActivitePartielleCard() {
	const { t } = useTranslation()
	const sitePaths = useContext(SitePathsContext)

	return (
		<Card
			title={t('gérer.choix.chomage-partiel.title', 'Activité partielle')}
			icon={<Emoji emoji="🕟" />}
			callToAction={{
				to: {
					pathname: sitePaths.simulateurs['chômage-partiel'],
				},
				label: t('gérer.choix.chomage-partiel.cta', 'Voir le simulateur'),
			}}
		>
			<Body>
				<Trans i18nKey="gérer.choix.chomage-partiel.body">
					Calculez le reste à payer après remboursement de l'État lorsque vous
					activez le dispositif pour un employé.
				</Trans>
			</Body>
		</Card>
	)
}
