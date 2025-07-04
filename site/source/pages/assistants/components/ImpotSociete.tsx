import { Trans, useTranslation } from 'react-i18next'

import { Card, Emoji } from '@/design-system'
import { useSitePaths } from '@/sitePaths'

export function ImpotSocieteCard() {
	const { absoluteSitePaths } = useSitePaths()
	const { t } = useTranslation()

	return (
		<Card
			title={t(
				'gérer.choix.is.title',
				'Estimer le montant de l’impôt sur les sociétés'
			)}
			icon={<Emoji emoji="🧾" />}
			ctaLabel={t('gérer.choix.is.cta', 'Lancer le simulateur')}
			to={{ pathname: absoluteSitePaths.simulateurs.is }}
			state={{ fromGérer: true }}
		>
			<Trans i18nKey="gérer.choix.is.body">
				Calculez le montant de l'impôt sur les sociétés à partir de votre
				bénéfice.
			</Trans>
		</Card>
	)
}
