import { useTranslation } from 'react-i18next'

import { Article } from '@/design-system/card'
import {
	usePromiseOnSituationChange,
	useWorkerEngine,
} from '@/worker/socialWorkerEngineClient'

export function AnnuaireEntreprises() {
	const { t } = useTranslation()
	const workerEngine = useWorkerEngine()

	const siren = usePromiseOnSituationChange(
		async () => await workerEngine.asyncEvaluate('entreprise . SIREN'),
		[workerEngine],
		{ defaultValue: null }
	)?.nodeValue as string | null

	return typeof siren === 'string' ? (
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
	) : null
}
