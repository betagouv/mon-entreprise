import Emoji from 'Components/utils/Emoji'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { Card } from 'DesignSystem/card'
import { Body } from 'DesignSystem/typography/paragraphs'
import { useContext } from 'react'
import { Trans, useTranslation } from 'react-i18next'

export function MontantEmbaucheCard() {
	const sitePaths = useContext(SitePathsContext)
	const { t } = useTranslation()
	return (
		<Card
			title={t(
				'gerer.choix.embauche.title',
				'Estimer le montant d’une embauche'
			)}
			icon={<Emoji emoji="🤝" />}
			callToAction={{
				to: {
					pathname: sitePaths.simulateurs.salarié,
					search: '?view=employeur',
					state: {
						fromGérer: true,
					},
				},
				label: t('gerer.choix.embauche.cta', 'Lancer le simulateur'),
			}}
		>
			<Body>
				<Trans i18nKey="gerer.choix.embauche.body">
					Calculez le montant total que votre entreprise devra dépenser pour
					rémunérer votre prochain employé
				</Trans>
			</Body>
		</Card>
	)
}
