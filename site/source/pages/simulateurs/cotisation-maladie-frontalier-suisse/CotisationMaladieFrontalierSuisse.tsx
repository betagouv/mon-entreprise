import { Route, Routes } from 'react-router-dom'

import { GroupeDeQuestionsFournies } from '@/components/Simulateur/ComposantQuestionFournie'
import { Simulateur } from '@/components/Simulateur/Simulateur'
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
import { ObjectifSalaires } from './objectifs/ObjectifSalaires'
import { RésultatCotisation } from './objectifs/RésultatCotisation'
import { DateAffiliationQuestion } from './questions/DateAffiliationQuestion'
import { DateFinAffiliationQuestion } from './questions/DateFinAffiliationQuestion'

const questionsPrincipales = [DateAffiliationQuestion]

const groupesDeQuestions: Record<
	string,
	GroupeDeQuestionsFournies<SituationFrontalierSuisse>
> = {
	'fin-affiliation': {
		titre: (t) =>
			t(
				'pages.simulateurs.cotisation-maladie-frontalier-suisse.questions.groupe-fin-affiliation.titre',
				'Fin d’affiliation'
			),
		liste: [DateFinAffiliationQuestion],
	},
}

const PageSimulateur = () => {
	const simulateurConfig = useSimulatorData(
		'cotisation-maladie-frontalier-suisse'
	)
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
				id="cotisation-maladie-frontalier-suisse"
				situation={situation}
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
