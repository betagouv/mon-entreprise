import * as O from 'effect/Option'
import { Route, Routes } from 'react-router-dom'

import { Simulateur } from '@/components/Simulateur/Simulateur'
import {
	estSituationValide,
	FrontalierSuisseProvider,
	situationEstCommencée,
	useFrontalierSuisse,
} from '@/contextes/frontalier-suisse'
import { docCotisationFrontalierSuisse } from '@/external-links/docCotisationFrontalierSuisse'
import { docDeclarerRevenusFrontalierSuisse } from '@/external-links/docDeclarerRevenusFrontalierSuisse'
import { docFrontalierSuisse } from '@/external-links/docFrontalierSuisse'
import { useSimulatorData } from '@/hooks/useSimulatorData'

import SimulateurPageLayout from '../SimulateurPageLayout'
import { DocumentationHub } from './documentation'
import { ObjectifAutresRevenus } from './objectifs/ObjectifAutresRevenus'
import { ObjectifSalaires } from './objectifs/ObjectifSalaires'
import { RésultatCotisation } from './objectifs/RésultatCotisation'
import { groupesDeQuestions, questionsPrincipales } from './questions'

const PageSimulateur = () => {
	const id = 'cotisation-maladie-frontalier-suisse'
	const simulateurConfig = useSimulatorData(id)
	const { situation, set } = useFrontalierSuisse()

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
			<Simulateur
				id={id}
				situation={situation}
				situationMinimaleSaisie={estSituationValide(situation)}
				questionsPrincipalesRépondues={O.isSome(situation.dateAffiliation)}
				questionsFourniesPrincipales={questionsPrincipales}
				groupesDeQuestionsFournies={groupesDeQuestions}
				montantsÀSaisir={
					<>
						<ObjectifSalaires />
						<ObjectifAutresRevenus />
						{estSituationValide(situation) && (
							<RésultatCotisation situation={situation} />
						)}
					</>
				}
				simulationEstCommencée={situationEstCommencée(situation)}
				onReset={set.reset}
			/>
		</SimulateurPageLayout>
	)
}

export default function CotisationMaladieFrontalierSuisse() {
	return (
		<FrontalierSuisseProvider>
			<Routes>
				<Route path="/documentation/*" element={<DocumentationHub />} />
				<Route path="/*" element={<PageSimulateur />} />
			</Routes>
		</FrontalierSuisseProvider>
	)
}
