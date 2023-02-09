import { useTranslation } from 'react-i18next'

import { useEngine } from '@/components/utils/EngineContext'
import { Article } from '@/design-system/card'

export function AnnuaireEntreprises() {
	const { t } = useTranslation()
	const engine = useEngine()

	const siren = engine.evaluate('entreprise . SIREN').nodeValue as string

	return (
		<>
			<Article
				title={t(
					'gérer.ressources.annuaire-entreprises.title',
					'Voir vos données publiques'
				)}
				href={`https://annuaire-entreprises.data.gouv.fr/entreprise/${siren}?mtm_campaign=mon-entreprise`}
				ctaLabel={t(
					'gérer.ressources.annuaire-entreprises.cta',
					'Visiter le site'
				)}
			>
				{t(
					'gérer.ressources.annuaire-entreprises.body',
					'Retrouvez toutes les informations publiques concernant votre entreprise sur'
				)}{' '}
				Annuaire des Entreprises.
			</Article>
		</>
	)
}
