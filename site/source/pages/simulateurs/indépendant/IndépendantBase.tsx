import { ReactNode } from 'react'
import { useDispatch } from 'react-redux'

import { type ConseillersEntreprisesVariant } from '@/components/ConseillersEntreprises/BoutonConseillersEntreprises'
import RuleInput from '@/components/conversation/RuleInput'
import SimulateurWarning from '@/components/SimulateurWarning'
import Simulation from '@/components/Simulation'
import { YearSelectionBanner } from '@/components/Simulation/YearSelectionBanner'
import { OpenGraph } from '@/components/utils/Meta'
import { ValeurPublicodes } from '@/domaine/engine/PublicodesAdapter'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { PublicodesSimulationConfig } from '@/domaine/PublicodesSimulationConfig'
import { premiersMoisUrssaf } from '@/external-links/premiersMoisUrssaf'
import { serviceExpertComptable } from '@/external-links/serviceExpertComptable'
import { serviceIndépendant } from '@/external-links/serviceIndépendant'
import { servicePAM } from '@/external-links/servicePAM'
import { servicePLR } from '@/external-links/servicePLR'
import useSimulationPublicodes from '@/hooks/useSimulationPublicodes'
import {
	MergedSimulatorMetadata,
	SimulateurId,
} from '@/hooks/useSimulatorsMetadata'
import ExplicationsIndépendant from '@/pages/simulateurs/indépendant/components/Explications'
import { ObjectifsIndépendant } from '@/pages/simulateurs/indépendant/components/Objectifs'
import { ajusteLaSituation } from '@/store/actions/actions'
import { EngineProvider } from '@/utils/publicodes/EngineContext'

import { ExternalLink } from '../_configs/types'
import SimulateurPageLayout from '../SimulateurPageLayout'
import { AvertissementAnnéeCotisationsIndépendant } from './components/AvertissementAnnéeCotisationsIndépendant'
import { AvertissementAutoEntrepreneur } from './components/AvertissementAutoEntrepreneur'
import { AvertissementDoubleRégimeIndépendant } from './components/AvertissementDoubleRégimeIndépendant'

const nextSteps = ['is', 'comparaison-statuts'] satisfies SimulateurId[]

const externalLinks = [premiersMoisUrssaf]

const conditionalExternalLinks = [
	serviceIndépendant,
	servicePLR,
	servicePAM,
	serviceExpertComptable,
]

type Props = {
	metadata: MergedSimulatorMetadata
	simulation: PublicodesSimulationConfig
	avertissement?: ReactNode
	openGraph?: OpenGraph
	seoExplanations?: ReactNode
	conseillersEntreprisesVariant?: ConseillersEntreprisesVariant
}

export default function IndépendantBase({
	metadata,
	simulation,
	avertissement,
	openGraph,
	seoExplanations,
	conseillersEntreprisesVariant,
}: Props) {
	const dispatch = useDispatch()
	const { isReady, engine, questions, raccourcis } = useSimulationPublicodes(
		metadata,
		simulation
	)
	const id = metadata.id

	const relevantConditionalExternalLinks = conditionalExternalLinks?.filter(
		({ associatedRule }) => engine.evaluate(associatedRule).nodeValue
	) as ExternalLink[]
	const allExternalLinks =
		relevantConditionalExternalLinks.concat(externalLinks)

	const confusionAEPossible = [
		'indépendant',
		'entreprise-individuelle',
		'profession-libérale',
		'cipav',
	]

	return (
		<EngineProvider value={engine}>
			<SimulateurPageLayout
				metadata={metadata}
				openGraph={openGraph}
				seoExplanations={seoExplanations}
				isReady={isReady}
				nextSteps={nextSteps}
				externalLinks={allExternalLinks}
			>
				<Simulation
					questionsPublicodes={questions}
					raccourcisPublicodes={raccourcis}
					conseillersEntreprisesVariant={conseillersEntreprisesVariant}
					explanations={<ExplicationsIndépendant />}
					afterQuestionsSlot={<YearSelectionBanner />}
				>
					<SimulateurWarning
						metadata={metadata}
						informationsComplémentaires={
							<>
								{confusionAEPossible.indexOf(id) > -1 && (
									<AvertissementAutoEntrepreneur />
								)}
								{avertissement}
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
