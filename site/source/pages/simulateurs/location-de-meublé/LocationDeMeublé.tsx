import { Route, Routes } from 'react-router-dom'

import SimulateurWarning from '@/components/SimulateurWarning'
import Simulation, { SimulationGoals } from '@/components/Simulation'
import {
	ÉconomieCollaborativeProvider,
	estSituationValide,
	SituationÉconomieCollaborative,
	useEconomieCollaborative,
} from '@/contextes/économie-collaborative'
import { Button, ConteneurBleu } from '@/design-system'
import { ComparateurRégimesCards } from '@/pages/simulateurs/location-de-meublé/components/ComparateurRégimesCards'
import { ObjectifRecettes } from '@/pages/simulateurs/location-de-meublé/objectifs/ObjectifRecettes'
import {
	// AlsaceMoselleQuestion,
	AutresRevenusQuestion,
	// PremiereAnneeQuestion,
	TypeDuréeQuestion,
	TypeLocationQuestion,
} from '@/pages/simulateurs/location-de-meublé/questions'
import { useSitePaths } from '@/sitePaths'

import { DocumentationHub } from './documentation'

const LocationDeMeublé = () => {
	const { situation } = useEconomieCollaborative()
	const { absoluteSitePaths } = useSitePaths()

	return (
		<>
			<Simulation<SituationÉconomieCollaborative>
				entrepriseSelection={false}
				situation={situation}
				questions={[
					TypeDuréeQuestion,
					AutresRevenusQuestion,
					TypeLocationQuestion,
					// PremiereAnneeQuestion,
					// AlsaceMoselleQuestion,
				]}
				showQuestionsFromBeginning={estSituationValide(situation)}
				avecQuestionsPublicodes={false}
			>
				<SimulateurWarning simulateur="location-de-logement-meublé" />
				<SimulationGoals>
					<ObjectifRecettes />
				</SimulationGoals>
			</Simulation>
			{estSituationValide(situation) && (
				<ConteneurBleu>
					<ComparateurRégimesCards />
				</ConteneurBleu>
			)}
			<ConteneurBleu foncé>
				<Button
					size="XS"
					light
					to={
						absoluteSitePaths.simulateurs['location-de-logement-meublé'] +
						'/documentation'
					}
				>
					📚 Documentation
				</Button>
			</ConteneurBleu>
		</>
	)
}

const LocationDeMeubléWithProvider = () => (
	<ÉconomieCollaborativeProvider>
		<Routes>
			<Route path="/documentation/*" element={<DocumentationHub />} />
			<Route path="/*" element={<LocationDeMeublé />} />
		</Routes>
	</ÉconomieCollaborativeProvider>
)

export default LocationDeMeubléWithProvider
