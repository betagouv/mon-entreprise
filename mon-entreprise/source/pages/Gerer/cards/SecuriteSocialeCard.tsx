import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { Card } from 'DesignSystem/card'
import { Body } from 'DesignSystem/typography/paragraphs'
import { useContext } from 'react'
import { Trans, useTranslation } from 'react-i18next'

export function SecuriteSocialeCard() {
	const sitePaths = useContext(SitePathsContext)
	const { t } = useTranslation()

	return (
		<Card
			title={t(
				'gérer.ressources.sécuritéSociale.title',
				'Comprendre la sécurité sociale '
			)}
			callToAction={{
				to: sitePaths.gérer.sécuritéSociale,
				label: t('gérer.ressources.sécuritéSociale.cta', 'Lire le guide'),
			}}
		>
			<Body>
				<Trans i18nKey="gérer.ressources.sécuritéSociale.body">
					A quoi servent les cotisations sociales ? Le point sur le système de
					protection sociale dont bénéficient tous les travailleurs en France.
				</Trans>
			</Body>
		</Card>
	)
}
