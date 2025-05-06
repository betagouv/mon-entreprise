import { Trans, useTranslation } from 'react-i18next'

import { Article } from '@/design-system/card'

export function ReductionGeneraleCard() {
	const { t } = useTranslation()

	return (
		<Article
			title={
				<h3>
					<Trans i18nKey="gérer.ressources.réductionGénérale.title">
						La réduction générale des cotisations
					</Trans>
				</h3>
			}
			ctaLabel={t(
				'gérer.ressources.réductionGénérale.cta',
				'Consulter le guide'
			)}
			aria-label={t(
				'gérer.ressources.réductionGénérale.aria-label',
				'Consulter le guide sur urssaf.fr, nouvelle fenêtre'
			)}
			href="https://www.urssaf.fr/accueil/employeur/beneficier-exonerations/reduction-generale-cotisation.html"
		>
			<Trans i18nKey="gérer.ressources.réductionGénérale.body">
				Calcul, déclaration, règles... Consultez le guide de l'Urssaf sur la
				réduction générale des cotisations.
			</Trans>
		</Article>
	)
}
