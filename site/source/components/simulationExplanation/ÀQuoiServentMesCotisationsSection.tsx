import { Trans } from 'react-i18next'

import { DistributionDesCotisations } from '@/components/simulationExplanation/DistributionDesCotisations'
import { H2, Link, SmallBody } from '@/design-system'
import { DottedName } from '@/domaine/publicodes/DottedName'

interface Props {
	regroupement: Partial<Record<DottedName, Array<string>>>
}

export const ÀQuoiServentMesCotisationsSection = ({ regroupement }: Props) => (
	<section className="print-no-break-inside">
		<H2>
			<Trans>À quoi servent mes cotisations ?</Trans>
		</H2>
		<DistributionDesCotisations regroupement={regroupement} />
		<SmallBody>
			<Trans>
				Pour en savoir plus, rendez-vous sur le site{' '}
				<Link
					href="https://www.aquoiserventlescotisations.urssaf.fr/"
					aria-label="aquoiserventlescotisations.urssaf.fr, nouvelle fenêtre"
				>
					aquoiserventlescotisations.urssaf.fr
				</Link>
			</Trans>
		</SmallBody>
	</section>
)
