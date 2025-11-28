import { Trans, useTranslation } from 'react-i18next'

import { DistributionDesCotisations } from '@/components/simulationExplanation/ÀQuoiServentMesCotisations/DistributionDesCotisations'
import { H2, Link, SmallBody } from '@/design-system'
import { DottedName } from '@/domaine/publicodes/DottedName'

interface Props {
	regroupement: Partial<Record<DottedName, Array<string>>>
}

export const ÀQuoiServentMesCotisationsSection = ({ regroupement }: Props) => {
	const { t } = useTranslation()

	return (
		<section className="print-no-break-inside">
			<H2>
				{t('aquoiserventmescotisations.h2', 'À quoi servent mes cotisations ?')}
			</H2>
			<DistributionDesCotisations regroupement={regroupement} />
			<SmallBody>
				<Trans i18nKey="aquoiserventmescotisations.en-savoir-plus">
					Pour en savoir plus, rendez-vous sur le site{' '}
					<Link
						href="https://www.aquoiserventlescotisations.urssaf.fr/"
						aria-label={t(
							'aria-label.aquoiserventlescotisations',
							'aquoiserventlescotisations.urssaf.fr, nouvelle fenêtre'
						)}
					>
						aquoiserventlescotisations.urssaf.fr
					</Link>
				</Trans>
			</SmallBody>
		</section>
	)
}
