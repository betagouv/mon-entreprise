import * as O from 'effect/Option'
import { useTranslation } from 'react-i18next'
import { Route, Routes } from 'react-router-dom'

import SimulateurWarning from '@/components/SimulateurWarning'
import Simulation, { SimulationGoals } from '@/components/Simulation'
import {
	annéeDeSimulation,
	annéeDesRevenus,
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
import { ObjectifDateAffiliation } from './objectifs/ObjectifDateAffiliation'
import { ObjectifRevenuAnnuel } from './objectifs/ObjectifRevenuAnnuel'
import { RésultatCotisation } from './objectifs/RésultatCotisation'

const Simulateur = () => {
	const simulateurConfig = useSimulatorData(
		'cotisation-maladie-frontalier-suisse'
	)
	const { situation, set } = useFrontalierSuisse()
	const { t } = useTranslation()

	const annéeRevenus = O.isSome(situation.dateAffiliation)
		? annéeDesRevenus(situation.dateAffiliation.value)
		: annéeDeSimulation()

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
					<ObjectifRevenuAnnuel
						id="frontalier-suisse-salaires"
						titre={t(
							'pages.simulateurs.cotisation-maladie-frontalier-suisse.objectifs.salaires',
							'Salaires perçus en {{annéeRevenus}}',
							{ annéeRevenus }
						)}
						valeur={situation.salaires}
						onChange={set.salaires}
					/>
					<ObjectifRevenuAnnuel
						id="frontalier-suisse-autres-revenus"
						titre={t(
							'pages.simulateurs.cotisation-maladie-frontalier-suisse.objectifs.autres-revenus',
							'Autres revenus perçus en {{annéeRevenus}}',
							{ annéeRevenus }
						)}
						valeur={situation.autresRevenus}
						onChange={set.autresRevenus}
					/>
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
