import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { Card } from 'DesignSystem/card'
import { Body } from 'DesignSystem/typography/paragraphs'
import { useContext } from 'react'
import { Trans, useTranslation } from 'react-i18next'

export function MobiliteCard() {
	const sitePaths = useContext(SitePathsContext)
	const { t } = useTranslation()
	return (
		<Card
			title={t(
				'gérer.ressources.export.title',
				'Exporter son activité en Europe'
			)}
			callToAction={{
				to: sitePaths.gérer.formulaireMobilité,
				label: t('gérer.ressources.export.cta', 'Remplir le formulaire'),
			}}
		>
			<Body>
				<Trans i18nKey="gérer.ressources.export.body">
					Le formulaire pour effectuer une demande de mobilité internationale
					(détachement ou pluriactivité)
				</Trans>
			</Body>
		</Card>
	)
}
