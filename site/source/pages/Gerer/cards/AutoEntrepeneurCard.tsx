import { Article } from 'DesignSystem/card'
import { Trans, useTranslation } from 'react-i18next'
export function AutoEntrepreneurCard() {
	const { t } = useTranslation()
	return (
		<Article
			title={
				<h3>
					<Trans i18nKey="gérer.ressources.autoEntrepreneur.title">
						Site officiel des auto-entrepreneurs
					</Trans>
				</h3>
			}
			ctaLabel={t('gérer.ressources.autoEntrepreneur.cta', 'Visiter le site')}
			href="https://autoentrepreneur.urssaf.fr"
		>
			<Trans i18nKey="gérer.ressources.autoEntrepreneur.body">
				Vous pourrez effectuer votre déclaration de chiffre d'affaires, payer
				vos cotisations, et plus largement trouver toutes les informations
				relatives au statut d'auto-entrepreneur
			</Trans>
		</Article>
	)
}
