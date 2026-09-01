import { useTranslation } from 'react-i18next'

import { TrackPage } from '@/components/PianoAnalytics'
import { SmallSimulateurCard } from '@/components/SmallSimulateurCard'
import { H2 } from '@/design-system'
import { premiersMoisUrssaf } from '@/external-links/premiersMoisUrssaf'
import { servicePAM } from '@/external-links/servicePAM'
import { usePageMetadata } from '@/hooks/usePageMetadata'
import { useSimulatorsMetadata } from '@/hooks/useSimulatorsMetadata'

import SimulateurPageLayout from '../SimulateurPageLayout'
import { pamcMetadata } from './metadata'

const externalLinks = [servicePAM, premiersMoisUrssaf]

export function PAMCHome() {
	const { t } = useTranslation()
	const simulators = useSimulatorsMetadata()
	const metadata = usePageMetadata(pamcMetadata)

	return (
		<>
			<TrackPage chapter1="simulateurs" name="accueil_pamc" />

			<SimulateurPageLayout
				metadata={metadata}
				externalLinks={externalLinks}
				showDate={false}
			>
				<H2>
					{t(
						'pages.simulateurs.pamc.titre',
						'Quelle profession exercez-vous ?'
					)}
				</H2>
				<div role="list">
					<SmallSimulateurCard
						role="listitem"
						{...simulators['auxiliaire-médical']}
					/>
					<SmallSimulateurCard
						role="listitem"
						{...simulators['chirurgien-dentiste']}
					/>
					<SmallSimulateurCard role="listitem" {...simulators.médecin} />
					<SmallSimulateurCard role="listitem" {...simulators['sage-femme']} />
				</div>
			</SimulateurPageLayout>
		</>
	)
}
