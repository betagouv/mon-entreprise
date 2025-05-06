import { Trans, useTranslation } from 'react-i18next'

import { Article } from '@/design-system/card'

export function AutoEntrepreneurCard() {
	const { t } = useTranslation()

	return (
		<Article
			title={
				<h3>
					<Trans i18nKey="gérer.ressources.auto-entrepreneur.title">
						Site officiel des auto-entrepreneurs
					</Trans>
				</h3>
			}
			ctaLabel={t('gérer.ressources.auto-entrepreneur.cta', 'Visiter le site')}
			aria-label={t(
				'gérer.ressources.auto-entrepreneur.aria-label',
				'auto-entrepreneur.urssaf.fr, Visiter le site'
			)}
			href="https://autoentrepreneur.urssaf.fr"
		>
			<Trans i18nKey="gérer.ressources.auto-entrepreneur.body">
				Vous pourrez effectuer votre déclaration de chiffre d'affaires, payer
				vos cotisations, et plus largement trouver toutes les informations
				relatives au statut d'auto-entrepreneur
			</Trans>
		</Article>
	)
}
