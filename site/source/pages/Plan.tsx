import { Trans, useTranslation } from 'react-i18next'

import { PlanDuSite } from '@/components/navigation/PlanDuSite'
import { TrackPage } from '@/components/PianoAnalytics'
import Meta from '@/components/utils/Meta'
import { H1 } from '@/design-system'

export default function Plan() {
	const { t } = useTranslation()

	return (
		<>
			<H1>
				<Trans i18nKey={'sitemap.title'}>Plan du site</Trans>
			</H1>
			<Meta
				title={t('sitemap.title', 'Plan du site')}
				description={t(
					'sitemap.description',
					"Page détaillant l'arborescence du site Mon-Entreprise."
				)}
			/>
			<TrackPage chapter1="navigation" name="plan-du-site" />

			<PlanDuSite size="XL" />
		</>
	)
}
