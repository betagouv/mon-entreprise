import Emoji from 'Components/utils/Emoji'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { Card } from 'DesignSystem/card'
import { Body } from 'DesignSystem/typography/paragraphs'
import { useContext } from 'react'
import { Trans, useTranslation } from 'react-i18next'

export function ImpotSocieteCard() {
	const sitePaths = useContext(SitePathsContext)
	const { t } = useTranslation()

	return (
		<Card
			title={t(
				'gérer.choix.is.title',
				'Estimer le montant de l’impôt sur les sociétés'
			)}
			icon={<Emoji emoji="🧾" />}
			callToAction={{
				to: {
					pathname: sitePaths.simulateurs.is,
					state: {
						fromGérer: true,
					},
				},
				label: t('gérer.choix.is.cta', 'Lancer le simulateur'),
			}}
		>
			<Body>
				<Trans i18nKey="gérer.choix.is.body">
					Calculez le montant de l'impôt sur les sociétés à partir de votre
					bénéfice.
				</Trans>
			</Body>
		</Card>
	)
}
