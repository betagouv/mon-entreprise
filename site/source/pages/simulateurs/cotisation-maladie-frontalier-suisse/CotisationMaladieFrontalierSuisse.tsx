import { Route, Routes } from 'react-router-dom'

import SimulateurWarning from '@/components/SimulateurWarning'
import Simulation, { SimulationGoals } from '@/components/Simulation'
import {
	estSituationValide,
	FrontalierSuisseProvider,
	situationEstCommencée,
	SituationFrontalierSuisse,
	useFrontalierSuisse,
} from '@/contextes/frontalier-suisse'
import { docCotisationFrontalierSuisse } from '@/external-links/docCotisationFrontalierSuisse'
import { docDeclarerRevenusFrontalierSuisse } from '@/external-links/docDeclarerRevenusFrontalierSuisse'
import { docFrontalierSuisse } from '@/external-links/docFrontalierSuisse'
import { useSimulatorData } from '@/hooks/useSimulatorData'

import SimulateurPageLayout from '../SimulateurPageLayout'
import { DocumentationHub } from './documentation'
import { ObjectifAutresRevenus } from './objectifs/ObjectifAutresRevenus'
import { ObjectifDateAffiliation } from './objectifs/ObjectifDateAffiliation'
import { ObjectifSalaires } from './objectifs/ObjectifSalaires'
import { RésultatCotisation } from './objectifs/RésultatCotisation'
import { DateFinAffiliationQuestion } from './questions/DateFinAffiliationQuestion'

const Simulateur = () => {
	const simulateurConfig = useSimulatorData(
		'cotisation-maladie-frontalier-suisse'
	)
	const { situation } = useFrontalierSuisse()

	const externalLinks = [
		docFrontalierSuisse,
		docCotisationFrontalierSuisse,
		docDeclarerRevenusFrontalierSuisse,
	]

	return (
		<SimulateurPageLayout
			simulateurConfig={simulateurConfig}
			externalLinks={externalLinks}
			showDate={false}
		>
			<Simulation<SituationFrontalierSuisse>
				entrepriseSelection={false}
				situation={situation}
				simulationEstCommencée={(s) => (s ? situationEstCommencée(s) : false)}
				questions={[DateFinAffiliationQuestion]}
				hideDetails
			>
				<SimulateurWarning simulateur="cotisation-maladie-frontalier-suisse" />
				<SimulationGoals>
					<ObjectifDateAffiliation />
					<ObjectifSalaires />
					<ObjectifAutresRevenus />
					{estSituationValide(situation) && (
						<RésultatCotisation situation={situation} />
					)}
				</SimulationGoals>
			</Simulation>
		</SimulateurPageLayout>
	)
}

export default function CotisationMaladieFrontalierSuisse() {
	return (
		<FrontalierSuisseProvider>
			<Routes>
				<Route path="/documentation/*" element={<DocumentationHub />} />
				<Route path="/*" element={<Simulateur />} />
			</Routes>
		</FrontalierSuisseProvider>
	)
}
