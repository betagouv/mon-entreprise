import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { Card } from 'DesignSystem/card'
import { Body } from 'DesignSystem/typography/paragraphs'
import { useContext } from 'react'
import { Trans, useTranslation } from 'react-i18next'

export function DemarcheEmbaucheCard() {
	const sitePaths = useContext(SitePathsContext)
	const { t } = useTranslation()
	return (
		<Card
			title={t(
				'gérer.ressources.embaucher.title',
				'Découvrir les démarches d’embauche '
			)}
			callToAction={{
				to: sitePaths.gérer.embaucher,
				label: t(
					'gérer.ressources.embaucher.cta',
					'Voir la liste des démarches'
				),
			}}
		>
			<Body>
				<Trans i18nKey="gérer.ressources.embaucher.body">
					La liste des choses à faire pour être sûr de ne rien oublier lors de
					l’embauche d’un nouveau salarié
				</Trans>
			</Body>
		</Card>
	)
}
