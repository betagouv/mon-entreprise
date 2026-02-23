import { useDispatch } from 'react-redux'

import RuleInput from '@/components/conversation/RuleInput'
import SimulateurWarning from '@/components/SimulateurWarning'
import Simulation from '@/components/Simulation'
import AvertissementAnnéeCotisationsIndépendant from '@/components/Simulation/Avertissements/AvertissementAnnéeCotisationsIndépendant'
import AvertissementDoubleRégimeIndépendant from '@/components/Simulation/Avertissements/AvertissementDoubleRégimeIndépendant'
import { YearSelectionBanner } from '@/components/Simulation/YearSelectionBanner'
import { Body } from '@/design-system'
import { ValeurPublicodes } from '@/domaine/engine/PublicodesAdapter'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { premiersMoisUrssaf } from '@/external-links/premiersMoisUrssaf'
import { serviceExpertComptable } from '@/external-links/serviceExpertComptable'
import { serviceIndépendant } from '@/external-links/serviceIndépendant'
import { servicePAM } from '@/external-links/servicePAM'
import { servicePLR } from '@/external-links/servicePLR'
import useSimulationPublicodes from '@/hooks/useSimulationPublicodes'
import { useSimulatorData } from '@/hooks/useSimulatorData'
import { SimulateurId } from '@/hooks/useSimulatorsData'
import ExplicationsIndépendant from '@/pages/simulateurs/indépendant/components/Explications'
import { ObjectifsIndépendant } from '@/pages/simulateurs/indépendant/components/Objectifs'
import { ajusteLaSituation } from '@/store/actions/actions'
import { EngineProvider } from '@/utils/publicodes/EngineContext'

import { ExternalLink } from '../_configs/types'
import SimulateurPageLayout from '../SimulateurPageLayout'

const nextSteps = ['is', 'comparaison-statuts'] satisfies SimulateurId[]

const externalLinks = [premiersMoisUrssaf]

const conditionalExternalLinks = [
	serviceIndépendant,
	servicePLR,
	servicePAM,
	serviceExpertComptable,
]

type Props = {
	id: (
		| 'indépendant'
		| 'eirl'
		| 'entreprise-individuelle'
		| 'eurl'
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

export default function IndépendantBase({ id }: Props) {
	const dispatch = useDispatch()
	const simulateurConfig = useSimulatorData(id)
	const { isReady, engine, questions, raccourcis } =
		useSimulationPublicodes(simulateurConfig)

	const relevantConditionalExternalLinks = conditionalExternalLinks?.filter(
		({ associatedRule }) => engine.evaluate(associatedRule).nodeValue
	) as ExternalLink[]
	const allExternalLinks =
		relevantConditionalExternalLinks.concat(externalLinks)

	const Warning = simulateurConfig.warning

	return (
		<EngineProvider value={engine}>
			<SimulateurPageLayout
				simulateurConfig={simulateurConfig}
				isReady={isReady}
				nextSteps={nextSteps}
				externalLinks={allExternalLinks}
			>
				<Simulation
					questionsPublicodes={questions}
					raccourcisPublicodes={raccourcis}
					explanations={<ExplicationsIndépendant />}
					afterQuestionsSlot={<YearSelectionBanner />}
				>
					<SimulateurWarning
						simulateur={id}
						informationsComplémentaires={
							<>
								{Warning && <Warning />}
								<Body>
									<AvertissementAnnéeCotisationsIndépendant />
								</Body>
								<Body>
									<AvertissementDoubleRégimeIndépendant />
								</Body>
							</>
						}
					/>
					<ObjectifsIndépendant
						toggles={
							<>
								<RuleInput
									inputType="toggle"
									hideDefaultValue
									missing={false}
									dottedName="entreprise . imposition"
									onChange={(imposition) => {
										dispatch(
											ajusteLaSituation({
												'entreprise . imposition': imposition,
											} as Record<DottedName, ValeurPublicodes | undefined>)
										)
									}}
								/>
							</>
						}
					/>
				</Simulation>
			</SimulateurPageLayout>
		</EngineProvider>
	)
}
