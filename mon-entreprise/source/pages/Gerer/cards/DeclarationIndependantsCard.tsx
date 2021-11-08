import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { Card } from 'DesignSystem/card'
import { Body } from 'DesignSystem/typography/paragraphs'
import { useContext } from 'react'
import { Trans, useTranslation } from 'react-i18next'

export function DeclarationIndedependantsCard() {
	const sitePaths = useContext(SitePathsContext)
	const { t } = useTranslation()
	return (
		<Card
			title={t(
				'gérer.choix.déclaration.title',
				'Déclaration de revenus (indépendants)'
			)}
			callToAction={{
				label: t('gérer.choix.déclaration.cta', 'Remplir ma déclaration'),
				to: {
					pathname: sitePaths.gérer.déclarationIndépendant,
				},
			}}
		>
			<Body>
				<Trans i18nKey="gérer.choix.déclaration.body">
					Calculez facilement les montants des charges sociales à reporter dans
					votre déclaration de revenu au titre de 2020
				</Trans>
			</Body>
		</Card>
	)
}
