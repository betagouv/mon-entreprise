import { Route, Routes, useLocation } from 'react-router-dom'

import { ScrollToTop } from '@/components/utils/Scroll'
import { LANDING_LEGAL_STATUS_LIST, useSitePaths } from '@/sitePaths'

import AfterRegistration from './AfterRegistration'
import ChoixStatutJuridique from './choix-statut-juridique'
import CreationChecklist from './CreationChecklist'
import GuideStatut from './GuideStatut'

export default function ChoixDuStatut() {
	const { relativeSitePaths } = useSitePaths()
	const location = useLocation()

	return (
		<>
			<ScrollToTop key={location.pathname} />
			<Routes>
				<Route index element={<ChoixStatutJuridique />} />
				{LANDING_LEGAL_STATUS_LIST.map((statut) => (
					<Route
						key={statut}
						path={relativeSitePaths.assistants['choix-du-statut'][statut]}
						element={<CreationChecklist statut={statut} />}
					/>
				))}
				<Route
					path={relativeSitePaths.assistants['choix-du-statut'].après}
					element={<AfterRegistration />}
				/>
				<Route
					path={
						relativeSitePaths.assistants['choix-du-statut'].guideStatut.index +
						'/*'
					}
					element={<GuideStatut />}
				/>
			</Routes>
		</>
	)
}
