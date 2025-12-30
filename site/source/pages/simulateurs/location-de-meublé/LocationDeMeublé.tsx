import { Route, Routes } from 'react-router-dom'

import SimulateurWarning from '@/components/SimulateurWarning'
import Simulation, { SimulationGoals } from '@/components/Simulation'
import {
	ÉconomieCollaborativeProvider,
	estSituationValide,
	isCotisationsEnabled,
	SituationÉconomieCollaborative,
	useEconomieCollaborative,
} from '@/contextes/économie-collaborative'
import { Button, ConteneurBleu } from '@/design-system'
import { AffichageSelonAffiliation } from '@/pages/simulateurs/location-de-meublé/components/AffichageSelonAffiliation'
import { TypeHébergementSwitch } from '@/pages/simulateurs/location-de-meublé/components/TypeHébergementSwitch'
import { ObjectifAutresRevenus } from '@/pages/simulateurs/location-de-meublé/objectifs/ObjectifAutresRevenus'
import { ObjectifRecettes } from '@/pages/simulateurs/location-de-meublé/objectifs/ObjectifRecettes'
import { ObjectifRecettesNettes } from '@/pages/simulateurs/location-de-meublé/objectifs/ObjectifRecettesNettes'
import {
	AlsaceMoselleQuestion,
	ClassementQuestion,
	PremiereAnneeQuestion,
	RecettesCourteDuréeQuestion,
	TypeDuréeQuestion,
} from '@/pages/simulateurs/location-de-meublé/questions'
import { useSitePaths } from '@/sitePaths'

import { DocumentationHub } from './documentation'

const LocationDeMeublé = () => {
	const { situation } = useEconomieCollaborative()
	const { absoluteSitePaths } = useSitePaths()

	const isMeubléDeTourisme = situation.typeHébergement === 'meublé-tourisme'
	const isChambreDHôte = situation.typeHébergement === 'chambre-hôte'

	return (
		<>
			<Simulation<SituationÉconomieCollaborative>
				entrepriseSelection={false}
				situation={situation}
				questions={[
					TypeDuréeQuestion,
					RecettesCourteDuréeQuestion,
					ClassementQuestion,
					...(isCotisationsEnabled
						? [PremiereAnneeQuestion, AlsaceMoselleQuestion]
						: []),
				]}
				showQuestionsFromBeginning={estSituationValide(situation)}
				avecQuestionsPublicodes={false}
			>
				<SimulateurWarning simulateur="location-de-logement-meublé" />
				<SimulationGoals toggles={<TypeHébergementSwitch />}>
					{isMeubléDeTourisme && <ObjectifRecettes />}
					{isChambreDHôte && <ObjectifRecettesNettes />}
					{isMeubléDeTourisme && <ObjectifAutresRevenus />}
				</SimulationGoals>
			</Simulation>
			{estSituationValide(situation) && (
				<ConteneurBleu>
					<AffichageSelonAffiliation />
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
