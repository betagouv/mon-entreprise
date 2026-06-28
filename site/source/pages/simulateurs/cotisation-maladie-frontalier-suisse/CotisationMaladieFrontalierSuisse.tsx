import { useTranslation } from 'react-i18next'
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
import { useSimulatorData } from '@/hooks/useSimulatorData'
import { URSSAF } from '@/utils/logos'

import SimulateurPageLayout from '../SimulateurPageLayout'
import { DocumentationHub } from './documentation'
import { ObjectifAutresRevenus } from './objectifs/ObjectifAutresRevenus'
import { ObjectifDateAffiliation } from './objectifs/ObjectifDateAffiliation'
import { ObjectifSalaires } from './objectifs/ObjectifSalaires'
import { RésultatCotisation } from './objectifs/RésultatCotisation'

const Simulateur = () => {
	const simulateurConfig = useSimulatorData(
		'cotisation-maladie-frontalier-suisse'
	)
	const { situation } = useFrontalierSuisse()
	const { t } = useTranslation()

	const externalLinks = [
		{
			url: 'https://www.urssaf.fr/accueil/particulier/travailleur-frontalier-suisse.html',
			title: t(
				'pages.simulateurs.cotisation-maladie-frontalier-suisse.externalLinks.1.title',
				'Travailleurs frontaliers en Suisse'
			),
			description: t(
				'pages.simulateurs.cotisation-maladie-frontalier-suisse.externalLinks.1.description',
				"Affiliation, droit d'option et paiement de votre cotisation maladie auprès de l'Urssaf."
			),
			logo: URSSAF,
			ctaLabel: t('external-links.service.ctaLabel', 'Accéder au service'),
			ariaLabel: t(
				'external-links.service.ariaLabel',
				'Accéder au service sur urssaf.fr, nouvelle fenêtre'
			),
		},
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
