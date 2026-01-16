import { useTranslation } from 'react-i18next'

import { TrackPage } from '@/components/ATInternetTracking'
import { SimulateurCard } from '@/components/SimulateurCard'
import { H2 } from '@/design-system'
import { premiersMoisUrssaf } from '@/external-links/premiersMoisUrssaf'
import { servicePAM } from '@/external-links/servicePAM'
import useSimulatorsData from '@/hooks/useSimulatorsData'

import SimulateurPageLayout from '../SimulateurPageLayout'

const externalLinks = [servicePAM, premiersMoisUrssaf]

export default function PAMCHome() {
	const { t } = useTranslation()
	const simulators = useSimulatorsData()
	const simulateurConfig = simulators.pamc

	return (
		<>
			<TrackPage chapter1="simulateurs" name="accueil_pamc" />

			<SimulateurPageLayout
				simulateurConfig={simulateurConfig}
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
					<SimulateurCard
						small
						{...simulators['auxiliaire-médical']}
						role="listitem"
					/>
					<SimulateurCard
						small
						{...simulators['chirurgien-dentiste']}
						role="listitem"
					/>
					<SimulateurCard small {...simulators.médecin} role="listitem" />
					<SimulateurCard small {...simulators['sage-femme']} role="listitem" />
				</div>
			</SimulateurPageLayout>
		</>
	)
}
