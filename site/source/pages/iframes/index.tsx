import { ReactNode } from 'react'
import { Helmet } from 'react-helmet-async'
import { Outlet, Route, Routes } from 'react-router-dom'

import { usePlausibleTracking } from '@/hooks/usePlausibleTracking'
import {
	MergedSimulatorMetadata,
	useSimulatorsMetadata,
} from '@/hooks/useSimulatorsMetadata'
import Page404 from '@/pages/404'
import ChoixDuStatut from '@/pages/assistants/choix-du-statut'
import PourMonEntreprise from '@/pages/assistants/pour-mon-entreprise'
import SearchCodeApePage from '@/pages/assistants/recherche-code-ape'
import { ActivitéPartielle } from '@/pages/simulateurs/activité-partielle/ActivitéPartielle'
import { Artisan } from '@/pages/simulateurs/artisan/Artisan'
import { ArtisteAuteur } from '@/pages/simulateurs/artiste-auteur/ArtisteAuteur'
import { AutoEntrepreneur } from '@/pages/simulateurs/auto-entrepreneur/AutoEntrepreneur'
import { AuxiliaireMédical } from '@/pages/simulateurs/auxiliaire-médical/AuxiliaireMédical'
import { Avocat } from '@/pages/simulateurs/avocat/Avocat'
import { CessationActivitéSimulation } from '@/pages/simulateurs/cessation-activité/CessationActivité'
import { ChirurgienDentiste } from '@/pages/simulateurs/chirurgien-dentiste/ChirurgienDentiste'
import { Cipav } from '@/pages/simulateurs/cipav/Cipav'
import { Commerçant } from '@/pages/simulateurs/commercant/Commercant'
import { ComparateurDeStatuts } from '@/pages/simulateurs/comparaison-statuts/ComparateurDeStatuts'
import CotisationMaladieFrontalierSuisse from '@/pages/simulateurs/cotisation-maladie-frontalier-suisse/CotisationMaladieFrontalierSuisse'
import CoutCreationEntreprise from '@/pages/simulateurs/cout-creation-entreprise'
import DividendesSimulation from '@/pages/simulateurs/dividendes/Dividendes'
import { EIRL } from '@/pages/simulateurs/eirl/EIRL'
import { EntrepriseIndividuelle } from '@/pages/simulateurs/entreprise-individuelle/EntrepriseIndividuelle'
import { EURL } from '@/pages/simulateurs/eurl/EURL'
import { ExpertComptable } from '@/pages/simulateurs/expert-comptable/ExpertComptable'
import ISSimulation from '@/pages/simulateurs/impot-societe'
import { Indépendant } from '@/pages/simulateurs/indépendant/Indépendant'
import LocationDeMeublé from '@/pages/simulateurs/location-de-meublé/LocationDeMeublé'
import LodeomSimulation from '@/pages/simulateurs/lodeom/Lodeom'
import { Médecin } from '@/pages/simulateurs/médecin/Médecin'
import { PAMCHome } from '@/pages/simulateurs/pamc/PAMCHome'
import { Pharmacien } from '@/pages/simulateurs/pharmacien/Pharmacien'
import { ProfessionLibérale } from '@/pages/simulateurs/profession-libérale/ProfessionLibérale'
import { SageFemme } from '@/pages/simulateurs/sage-femme/SageFemme'
import SalariéSimulation from '@/pages/simulateurs/salarié/Salarié'
import { SASUSimulation } from '@/pages/simulateurs/sasu/SASU'

import IframeFooter from './IframeFooter'

const ChromeIframe = ({
	avecAvis = false,
	avecLogo = false,
}: {
	avecAvis?: boolean
	avecLogo?: boolean
}) => (
	<>
		<Outlet />
		<IframeFooter avecAvis={avecAvis} avecLogo={avecLogo} />
	</>
)

const PageIframe = ({
	métadonnées,
	children,
}: {
	métadonnées: MergedSimulatorMetadata
	children: ReactNode
}) => (
	<>
		<Helmet>
			<link rel="canonical" href={métadonnées.path} />
		</Helmet>
		{children}
	</>
)

export default function Iframes() {
	usePlausibleTracking()
	const simulateurs = useSimulatorsMetadata()

	const routeIframe = (
		métadonnées: MergedSimulatorMetadata,
		élément: ReactNode
	) => (
		<Route
			path={métadonnées.iframePath + '/*'}
			element={<PageIframe métadonnées={métadonnées}>{élément}</PageIframe>}
		/>
	)

	return (
		<>
			{/** Open external links in the parent frame.
			This behavior can be configured on individual link, eg <a target="_blank" />.
			Our own link are handled in-app by the router, and aren't affected by this directive.
			*/}
			<base target="_parent" />
			<Routes>
				<Route element={<ChromeIframe avecAvis />}>
					{routeIframe(simulateurs.salarié, <SalariéSimulation />)}
					{routeIframe(
						simulateurs['entreprise-individuelle'],
						<EntrepriseIndividuelle />
					)}
					{routeIframe(simulateurs.eirl, <EIRL />)}
					{routeIframe(simulateurs.sasu, <SASUSimulation />)}
					{routeIframe(simulateurs.eurl, <EURL />)}
					{routeIframe(simulateurs['auto-entrepreneur'], <AutoEntrepreneur />)}
					{routeIframe(simulateurs.indépendant, <Indépendant />)}
					{routeIframe(simulateurs.artisan, <Artisan />)}
					{routeIframe(simulateurs.commerçant, <Commerçant />)}
					{routeIframe(simulateurs['artiste-auteur'], <ArtisteAuteur />)}
					{routeIframe(
						simulateurs['activité-partielle'],
						<ActivitéPartielle />
					)}
					{routeIframe(
						simulateurs['comparaison-statuts'],
						<ComparateurDeStatuts />
					)}
					{routeIframe(simulateurs.pamc, <PAMCHome />)}
					{routeIframe(simulateurs.médecin, <Médecin />)}
					{routeIframe(simulateurs.pharmacien, <Pharmacien />)}
					{routeIframe(
						simulateurs['chirurgien-dentiste'],
						<ChirurgienDentiste />
					)}
					{routeIframe(simulateurs['sage-femme'], <SageFemme />)}
					{routeIframe(
						simulateurs['auxiliaire-médical'],
						<AuxiliaireMédical />
					)}
					{routeIframe(simulateurs.avocat, <Avocat />)}
					{routeIframe(simulateurs['expert-comptable'], <ExpertComptable />)}
					{routeIframe(
						simulateurs['profession-libérale'],
						<ProfessionLibérale />
					)}
					{routeIframe(simulateurs.dividendes, <DividendesSimulation />)}
					{routeIframe(
						simulateurs['coût-création-entreprise'],
						<CoutCreationEntreprise />
					)}
					{routeIframe(simulateurs.is, <ISSimulation />)}
					{routeIframe(simulateurs.cipav, <Cipav />)}
					{routeIframe(simulateurs.lodeom, <LodeomSimulation />)}
					{routeIframe(
						simulateurs['cessation-activité'],
						<CessationActivitéSimulation />
					)}
					{routeIframe(
						simulateurs['location-de-logement-meublé'],
						<LocationDeMeublé />
					)}
					{routeIframe(
						simulateurs['cotisation-maladie-frontalier-suisse'],
						<CotisationMaladieFrontalierSuisse />
					)}
				</Route>

				<Route element={<ChromeIframe avecAvis avecLogo />}>
					{routeIframe(simulateurs['choix-statut'], <ChoixDuStatut />)}
					{routeIframe(
						simulateurs['pour-mon-entreprise'],
						<PourMonEntreprise />
					)}
					{routeIframe(
						simulateurs['recherche-code-ape'],
						<SearchCodeApePage />
					)}
					<Route path="*" element={<Page404 />} />
				</Route>
			</Routes>
		</>
	)
}
