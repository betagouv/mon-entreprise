import Emoji from '@/components/utils/Emoji'
import { SitePathsContext } from '@/components/utils/SitePathsContext'
import { Card } from '@/design-system/card'
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
			ctaLabel={t('gérer.choix.is.cta', 'Lancer le simulateur')}
			to={{ pathname: sitePaths.simulateurs.is }}
			state={{ fromGérer: true }}
		>
			<Trans i18nKey="gérer.choix.is.body">
				Calculez le montant de l'impôt sur les sociétés à partir de votre
				bénéfice.
			</Trans>
		</Card>
	)
}
