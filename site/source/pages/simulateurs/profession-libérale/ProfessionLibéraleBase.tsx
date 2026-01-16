import { useTranslation } from 'react-i18next'

import SimulateurWarning from '@/components/SimulateurWarning'
import Simulation from '@/components/Simulation'
import AvertissementAnnéeCotisationsIndépendant from '@/components/Simulation/Avertissements/AvertissementAnnéeCotisationsIndépendant'
import { YearSelectionBanner } from '@/components/Simulation/YearSelectionBanner'
import { DarkLi, Ul } from '@/design-system'
import { premiersMoisUrssaf } from '@/external-links/premiersMoisUrssaf'
import { serviceExpertComptable } from '@/external-links/serviceExpertComptable'
import { serviceIndépendant } from '@/external-links/serviceIndépendant'
import { servicePAM } from '@/external-links/servicePAM'
import { servicePLR } from '@/external-links/servicePLR'
import useSimulationPublicodes from '@/hooks/useSimulationPublicodes'
import { useSimulatorData } from '@/hooks/useSimulatorData'
import { SimulateurId } from '@/hooks/useSimulatorsData'
import ExplicationsIndépendant from '@/pages/simulateurs/indépendant/components/Explications'
import { IndépendantSimulationGoals } from '@/pages/simulateurs/indépendant/Goals'
import { EngineProvider } from '@/utils/publicodes/EngineContext'

import { ExternalLink } from '../_configs/types'
import SimulateurPageLayout from '../SimulateurPageLayout'

const externalLinks = [premiersMoisUrssaf]

const conditionalExternalLinks = [
	serviceIndépendant,
	servicePLR,
	servicePAM,
	serviceExpertComptable,
]

type Props = {
	id: (
		| 'profession-libérale'
		| 'auxiliaire-médical'
		| 'avocat'
		| 'chirurgien-dentiste'
		| 'cipav'
		| 'expert-comptable'
		| 'médecin'
		| 'pharmacien'
		| 'sage-femme'
	) &
		SimulateurId
}

export default function ProfessionLibéraleBase({ id }: Props) {
	const simulateurConfig = useSimulatorData(id)
	const { isReady, engine } = useSimulationPublicodes(simulateurConfig)

	const relevantConditionalExternalLinks = conditionalExternalLinks?.filter(
		({ associatedRule }) => engine.evaluate(associatedRule).nodeValue
	) as ExternalLink[]
	const allExternalLinks =
		relevantConditionalExternalLinks.concat(externalLinks)

	const { t } = useTranslation()

	return (
		<EngineProvider value={engine}>
			<SimulateurPageLayout
				simulateurConfig={simulateurConfig}
				isReady={isReady}
				externalLinks={allExternalLinks}
			>
				<Simulation
					explanations={<ExplicationsIndépendant />}
					afterQuestionsSlot={<YearSelectionBanner />}
				>
					<SimulateurWarning
						simulateur={id}
						informationsComplémentaires={
							<Ul>
								<DarkLi>
									{t(
										'pages.simulateurs.profession-libérale.warning.général',
										'Ce simulateur est à destination des professions libérales en BNC. Il ne prend pas en compte les sociétés d’exercice libéral.'
									)}
								</DarkLi>
								<DarkLi>
									<AvertissementAnnéeCotisationsIndépendant />
								</DarkLi>{' '}
								<DarkLi>
									{t(
										'pages.simulateurs.profession-libérale.warning.cotisations-ordinales',
										'Pour les professions réglementées, le simulateur ne calcule pas le montant des cotisations à l’ordre. Elles doivent être ajoutées manuellement dans la case « charges de fonctionnement ».'
									)}
								</DarkLi>
							</Ul>
						}
					/>
					<IndépendantSimulationGoals />
				</Simulation>
			</SimulateurPageLayout>
		</EngineProvider>
	)
}
