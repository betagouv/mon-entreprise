import { ScrollToTop } from '@/components/utils/Scroll'
import { Route, Routes, useLocation } from 'react-router-dom'
import { TrackChapter } from '../../ATInternetTracking'
import {
	LANDING_LEGAL_STATUS_LIST,
	useRelativeSitePaths,
} from '../../sitePaths'
import AfterRegistration from './AfterRegistration'
import CreationChecklist from './CreationChecklist'
import GuideStatut from './GuideStatut'
import Home from './Home'

export default function CreateMyCompany() {
	const relativeSitePaths = useRelativeSitePaths()
	const location = useLocation()

	return (
		<>
			<ScrollToTop key={location.pathname} />
			<TrackChapter chapter1="creer">
				<Routes>
					<Route index element={<Home />} />
					{LANDING_LEGAL_STATUS_LIST.map((statut) => (
						<Route
							key={statut}
							path={relativeSitePaths.créer[statut]}
							element={<CreationChecklist statut={statut} />}
						/>
					))}
					<Route
						path={relativeSitePaths.créer.après}
						element={<AfterRegistration />}
					/>
					<Route
						path={relativeSitePaths.créer.guideStatut.index + '/*'}
						element={<GuideStatut />}
					/>
				</Routes>
			</TrackChapter>
		</>
	)
}
