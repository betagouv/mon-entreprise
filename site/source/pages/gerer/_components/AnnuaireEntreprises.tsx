import { useEngine } from '@/components/utils/EngineContext'
import { Article } from '@/design-system/card'
import { useTranslation } from 'react-i18next'

export function AnnuaireEntreprises() {
	const { t } = useTranslation()
	const engine = useEngine()

	const siret = engine.evaluate('établissement . SIRET').nodeValue as string

	return (
		<>
			<Article
				title={t(
					'gérer.ressources.annuaire-entreprises.title',
					'Voir vos données publiques'
				)}
				href={`https://annuaire-entreprises.data.gouv.fr/entreprise/${siret}`}
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
