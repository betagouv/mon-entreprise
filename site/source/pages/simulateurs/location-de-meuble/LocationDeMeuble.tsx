import { useTranslation } from 'react-i18next'
import { Route, Routes } from 'react-router-dom'

import SimulateurWarning from '@/components/SimulateurWarning'
import Simulation, { SimulationGoals } from '@/components/Simulation/index'
import {
	ÉconomieCollaborativeProvider,
	estSituationValide,
	isCotisationsEnabled,
	SituationÉconomieCollaborative,
	useEconomieCollaborative,
} from '@/contextes/economie-collaborative/index'
import { simulationEstCommencée } from '@/contextes/economie-collaborative/domaine/location-de-meuble/situation'
import { Body, ConteneurBleu, Emoji, Message } from '@/design-system/index'
import { useSimulatorData } from '@/hooks/useSimulatorData'
import { AffichageSelonAffiliation } from '@/pages/simulateurs/location-de-meuble/components/AffichageSelonAffiliation'
import { TypeHébergementSwitch } from '@/pages/simulateurs/location-de-meuble/components/TypeHebergementSwitch'
import { ObjectifAutresRevenus } from '@/pages/simulateurs/location-de-meuble/objectifs/ObjectifAutresRevenus'
import { ObjectifRecettes } from '@/pages/simulateurs/location-de-meuble/objectifs/ObjectifRecettes'
import {
	AlsaceMoselleQuestion,
	ClassementQuestion,
	PremiereAnneeQuestion,
	RecettesCourteDuréeQuestion,
	TypeDuréeQuestion,
} from '@/pages/simulateurs/location-de-meuble/questions/index'
import { URSSAF } from '@/utils/logos'

import SimulateurPageLayout from '../SimulateurPageLayout'
import { DocumentationHub } from './documentation/index'

const LocationDeMeublé = () => {
	const id = 'location-de-logement-meublé'
	const simulateurConfig = useSimulatorData(id)
	const { t } = useTranslation()
	const { situation } = useEconomieCollaborative()

	const isMeubléDeTourisme = situation.typeHébergement === 'meublé-tourisme'
	const isChambreDHôte = situation.typeHébergement === 'chambre-hôte'

	const externalLinks = [
		{
			url: 'https://www.urssaf.fr/accueil/services/economie-collaborative.html',
			title: t(
				'pages.simulateurs.location-de-logement-meublé.externalLinks.1.title',
				'Le service Économie collaborative'
			),
			description: t(
				'pages.simulateurs.location-de-logement-meublé.externalLinks.1.description',
				'Vous louez des logements meublés ou des biens ? Le service Économie collaborative vous facilite la declaration et le paiement de vos cotisations.'
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
				simulationEstCommencée={simulationEstCommencée}
				hideDetails={true}
			>
				<SimulateurWarning simulateur="location-de-logement-meublé" />
				<SimulationGoals toggles={<TypeHébergementSwitch />}>
					{isMeubléDeTourisme && (
						<>
							<ObjectifRecettes />
							<ObjectifAutresRevenus />
						</>
					)}
					{isChambreDHôte && (
						<Message type="info" icon={<Emoji emoji="🚧" />}>
							<Body>
								{t(
									'pages.simulateurs.location-de-logement-meublé.chambre-hôtes.non-pris-en-charge',
									"Le cas des chambres d'hôtes n'est pas encore pris en charge par ce simulateur."
								)}
							</Body>
						</Message>
					)}
				</SimulationGoals>
			</Simulation>
			{isMeubléDeTourisme && estSituationValide(situation) && (
				<ConteneurBleu>
					<AffichageSelonAffiliation />
				</ConteneurBleu>
			)}
			{/* TODO: Réactiver quand la documentation sera à jour
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
			*/}
		</SimulateurPageLayout>
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
