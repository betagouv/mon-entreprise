import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { Article } from '@/design-system'
import { companySirenSelector } from '@/store/selectors/company/companySiren.selector'

export function AnnuaireEntreprises() {
	const { t } = useTranslation()

	const siren = useSelector(companySirenSelector) as string

	if (!siren) {
		return null
	}

	return (
		<>
			<Article
				title={t(
					'assistants.pour-mon-entreprise.annuaire-entreprises.title',
					'Voir vos données publiques'
				)}
				href={`https://annuaire-entreprises.data.gouv.fr/entreprise/${siren}?mtm_campaign=mon-entreprise`}
				ctaLabel={t(
					'assistants.pour-mon-entreprise.annuaire-entreprises.cta',
					'Visiter le site'
				)}
				aria-label={t(
					'assistants.pour-mon-entreprise.annuaire-entreprises.aria-label',
					'Annuaire-entreprise, Visiter le site'
				)}
			>
				{t(
					'assistants.pour-mon-entreprise.annuaire-entreprises.body',
					'Retrouvez toutes les informations publiques concernant votre entreprise sur'
				)}{' '}
				Annuaire des Entreprises.
			</Article>
		</>
	)
}
