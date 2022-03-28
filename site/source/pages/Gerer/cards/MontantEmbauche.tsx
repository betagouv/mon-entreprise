import Emoji from '@/components/utils/Emoji'
import { SitePathsContext } from '@/components/utils/SitePathsContext'
import { Card } from '@/design-system/card'
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
			to={{
				pathname: sitePaths.simulateurs.salarié,
				search: '?view=employeur',
				state: {
					fromGérer: true,
				},
			}}
			ctaLabel={t('gerer.choix.embauche.cta', 'Lancer le simulateur')}
		>
			<Trans i18nKey="gerer.choix.embauche.body">
				Calculez le montant total que votre entreprise devra dépenser pour
				rémunérer votre prochain employé
			</Trans>
		</Card>
	)
}
