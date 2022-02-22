import { ScrollToTop } from '~/components/utils/Scroll'
import { SitePathsContext } from '~/components/utils/SitePathsContext'
import { useContext } from 'react'
import { Route, Switch, useLocation } from 'react-router-dom'
import { TrackChapter } from '../../ATInternetTracking'
import { LANDING_LEGAL_STATUS_LIST } from '../../sitePaths'
import AfterRegistration from './AfterRegistration'
import CreationChecklist from './CreationChecklist'
import GuideStatut from './GuideStatut'
import Home from './Home'

export default function CreateMyCompany() {
	const sitePaths = useContext(SitePathsContext)
	const location = useLocation()
	return (
		<>
			<ScrollToTop key={location.pathname} />
			<TrackChapter chapter1="creer" />
			<Switch>
				<Route exact path={sitePaths.créer.index} component={Home} />
				{LANDING_LEGAL_STATUS_LIST.map((statut) => (
					<Route path={sitePaths.créer[statut]} key={statut}>
						<CreationChecklist statut={statut} />
					</Route>
				))}
				<Route path={sitePaths.créer.après} component={AfterRegistration} />
				<Route
					path={sitePaths.créer.guideStatut.index}
					component={GuideStatut}
				/>
			</Switch>
		</>
	)
}
