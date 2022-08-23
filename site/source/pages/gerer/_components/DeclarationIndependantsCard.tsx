import { Card } from '@/design-system/card'
import { useSitePaths } from '@/sitePaths'
import { Trans, useTranslation } from 'react-i18next'

export function DeclarationIndedependantsCard() {
	const { absoluteSitePaths } = useSitePaths()
	const { t } = useTranslation()

	return (
		<Card
			title={t(
				'gérer.choix.déclaration.title',
				'Déclaration de revenus (indépendants)'
			)}
			ctaLabel={t('gérer.choix.déclaration.cta', 'Remplir ma déclaration')}
			to={absoluteSitePaths.gérer.déclarationIndépendant.index}
		>
			<Trans i18nKey="gérer.choix.déclaration.body">
				Calculez facilement les montants des charges sociales à reporter dans
				votre déclaration de revenu au titre de 2020
			</Trans>
		</Card>
	)
}
