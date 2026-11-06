import { Navigate, Route, Routes } from 'react-router-dom'

import { Page404 } from '@/components/Page404'
import ScrollToTop from '@/components/utils/Scroll/ScrollToTop'
import { useSitePaths } from '@/hooks/useSitePaths'
import { useNavigation } from '@/lib/navigation'
import { LienDeRetour } from '@/simulateurs'
import { Salarié } from '@/simulateurs/salarié'

import { ActivitéPartielle } from './activité-partielle/ActivitéPartielle'
import { Artisan } from './artisan/Artisan'
import { ArtisteAuteur } from './artiste-auteur/ArtisteAuteur'
import { AutoEntrepreneur } from './auto-entrepreneur/AutoEntrepreneur'
import { AuxiliaireMédical } from './auxiliaire-médical/AuxiliaireMédical'
import { Avocat } from './avocat/Avocat'
import { CessationActivitéSimulation } from './cessation-activité/CessationActivité'
import { ChirurgienDentiste } from './chirurgien-dentiste/ChirurgienDentiste'
import { Cipav } from './cipav/Cipav'
import { Commerçant } from './commercant/Commercant'
import { ComparateurDeStatuts } from './comparaison-statuts/ComparateurDeStatuts'
import CotisationMaladieFrontalierSuisse from './cotisation-maladie-frontalier-suisse/CotisationMaladieFrontalierSuisse'
import CoutCreationEntreprise from './cout-creation-entreprise'
import DividendesSimulation from './dividendes/Dividendes'
import { EIRL } from './eirl/EIRL'
import { EntrepriseIndividuelle } from './entreprise-individuelle/EntrepriseIndividuelle'
import { EURL } from './eurl/EURL'
import { ExpertComptable } from './expert-comptable/ExpertComptable'
import ISSimulation from './impot-societe'
import { Indépendant } from './indépendant/Indépendant'
import LocationDeMeublé from './location-de-meublé/LocationDeMeublé'
import LodeomSimulation from './lodeom/Lodeom'
import { Médecin } from './médecin/Médecin'
import { PAMCHome } from './pamc/PAMCHome'
import { Pharmacien } from './pharmacien/Pharmacien'
import { ProfessionLibérale } from './profession-libérale/ProfessionLibérale'
import { RéductionGénérale } from './reduction-generale'
import { SageFemme } from './sage-femme/SageFemme'
import { SASUSimulation } from './sasu/SASU'

export default function Simulateurs() {
	const { absoluteSitePaths, relativeSitePaths } = useSitePaths()
	const { currentPath } = useNavigation()
	const simulateurs = relativeSitePaths.simulateurs
	const professionLibérale = simulateurs['profession-libérale']

	return (
		<>
			<ScrollToTop key={currentPath} />

			<LienDeRetour />
			<Routes>
				<Route
					index
					element={
						<Navigate to={absoluteSitePaths.simulateursEtAssistants} replace />
					}
				/>
				<Route
					path={simulateurs['réduction-générale']}
					element={<RéductionGénérale />}
				/>

				<Route path={simulateurs.salarié + '/*'} element={<Salarié />} />
				<Route
					path={simulateurs['entreprise-individuelle'] + '/*'}
					element={<EntrepriseIndividuelle />}
				/>
				<Route path={simulateurs.eirl + '/*'} element={<EIRL />} />
				<Route path={simulateurs.sasu + '/*'} element={<SASUSimulation />} />
				<Route path={simulateurs.eurl + '/*'} element={<EURL />} />
				<Route
					path={simulateurs['auto-entrepreneur'] + '/*'}
					element={<AutoEntrepreneur />}
				/>
				<Route
					path={simulateurs.indépendant + '/*'}
					element={<Indépendant />}
				/>
				<Route path={simulateurs.artisan + '/*'} element={<Artisan />} />
				<Route path={simulateurs.commerçant + '/*'} element={<Commerçant />} />
				<Route
					path={simulateurs['artiste-auteur'] + '/*'}
					element={<ArtisteAuteur />}
				/>
				<Route
					path={simulateurs['activité-partielle'] + '/*'}
					element={<ActivitéPartielle />}
				/>
				<Route
					path={simulateurs.comparaison + '/*'}
					element={<ComparateurDeStatuts />}
				/>
				<Route path={simulateurs.pamc + '/*'} element={<PAMCHome />} />
				<Route
					path={simulateurs.dividendes + '/*'}
					element={<DividendesSimulation />}
				/>
				<Route
					path={simulateurs['coût-création-entreprise'] + '/*'}
					element={<CoutCreationEntreprise />}
				/>
				<Route path={simulateurs.is + '/*'} element={<ISSimulation />} />
				<Route
					path={simulateurs.lodeom + '/*'}
					element={<LodeomSimulation />}
				/>
				<Route
					path={simulateurs['cessation-activité'] + '/*'}
					element={<CessationActivitéSimulation />}
				/>
				<Route
					path={simulateurs['location-de-logement-meublé'] + '/*'}
					element={<LocationDeMeublé />}
				/>
				<Route
					path={simulateurs['cotisation-maladie-frontalier-suisse'] + '/*'}
					element={<CotisationMaladieFrontalierSuisse />}
				/>

				<Route path={professionLibérale.index}>
					<Route index element={<ProfessionLibérale />} />
					<Route
						path={professionLibérale.médecin + '/*'}
						element={<Médecin />}
					/>
					<Route
						path={professionLibérale.pharmacien + '/*'}
						element={<Pharmacien />}
					/>
					<Route
						path={professionLibérale.auxiliaire + '/*'}
						element={<AuxiliaireMédical />}
					/>
					<Route
						path={professionLibérale['chirurgien-dentiste'] + '/*'}
						element={<ChirurgienDentiste />}
					/>
					<Route
						path={professionLibérale['sage-femme'] + '/*'}
						element={<SageFemme />}
					/>
					<Route path={professionLibérale.avocat + '/*'} element={<Avocat />} />
					<Route
						path={professionLibérale['expert-comptable'] + '/*'}
						element={<ExpertComptable />}
					/>
					<Route path={professionLibérale.cipav + '/*'} element={<Cipav />} />
					<Route path="*" element={<ProfessionLibérale />} />
				</Route>

				<Route path="*" element={<Page404 />} />
			</Routes>
		</>
	)
}
