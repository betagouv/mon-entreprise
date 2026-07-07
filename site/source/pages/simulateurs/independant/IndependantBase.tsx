import { useDispatch } from 'react-redux'

import RuleInput from '@/components/conversation/RuleInput'
import SimulateurWarning from '@/components/SimulateurWarning'
import Simulation from '@/components/Simulation/index'
import { YearSelectionBanner } from '@/components/Simulation/YearSelectionBanner'
import { ValeurPublicodes } from '@/domaine/engine/PublicodesAdapter'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { premiersMoisUrssaf } from '@/external-links/premiersMoisUrssaf'
import { serviceExpertComptable } from '@/external-links/serviceExpertComptable'
import { serviceIndépendant } from '@/external-links/serviceIndependant'
import { servicePAM } from '@/external-links/servicePAM'
import { servicePLR } from '@/external-links/servicePLR'
import useSimulationPublicodes from '@/hooks/useSimulationPublicodes'
import { useSimulatorData } from '@/hooks/useSimulatorData'
import { SimulateurId } from '@/hooks/useSimulatorsData'
import ExplicationsIndépendant from '@/pages/simulateurs/independant/components/Explications'
import { ObjectifsIndépendant } from '@/pages/simulateurs/independant/components/Objectifs'
import { ajusteLaSituation } from '@/store/actions/actions'
import { EngineProvider } from '@/utils/publicodes/EngineContext'

import { ExternalLink } from '../_configs/types'
import SimulateurPageLayout from '../SimulateurPageLayout'
import { AvertissementAnnéeCotisationsIndépendant } from './components/AvertissementAnneeCotisationsIndependant'
import { AvertissementAutoEntrepreneur } from './components/AvertissementAutoEntrepreneur'
import { AvertissementDoubleRégimeIndépendant } from './components/AvertissementDoubleRegimeIndependant'

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
		| 'independant'
		| 'eirl'
		| 'entreprise-individuelle'
		| 'eurl'
		| 'profession-liberale'
		| 'auxiliaire-medical'
		| 'avocat'
		| 'chirurgien-dentiste'
		| 'cipav'
		| 'expert-comptable'
		| 'medecin'
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

	const confusionAEPossible = [
		'independant',
		'entreprise-individuelle',
		'profession-liberale',
		'cipav',
	]

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
								{confusionAEPossible.indexOf(id) > -1 && (
									<AvertissementAutoEntrepreneur />
								)}
								{Warning && <Warning />}
								<AvertissementAnnéeCotisationsIndépendant />
								<AvertissementDoubleRégimeIndépendant />
							</>
						}
					/>
					<ObjectifsIndépendant
						toggles={
							<>
								<RuleInput
									inputType="toggle"
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
