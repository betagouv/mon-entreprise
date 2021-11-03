import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { useContext } from 'react'
import { Trans } from 'react-i18next'
import { NavLink, Route, Switch } from 'react-router-dom'
import { TrackChapter } from '../../../ATInternetTracking'
import Activité from './Activité'
import ActivitésSelection from './ActivitésSelection'
import reducer from './reducer'
import { StoreProvider } from './StoreContext'
import VotreSituation from './VotreSituation'
import useSimulatorsData from '../metadata'
import { useIsEmbedded } from 'Components/utils/embeddedContext'

export default function ÉconomieCollaborative() {
	const sitePaths = useContext(SitePathsContext)
	const iframePath = useSimulatorsData()['économie-collaborative'].iframePath
	const indexPath = useIsEmbedded()
		? '/iframes/' + iframePath
		: sitePaths.simulateurs.économieCollaborative.index
	return (
		<>
			<TrackChapter chapter1="simulateurs" chapter2="economie_collaborative" />
			<div css="transform: translateY(2rem)">
				<NavLink
					to={indexPath}
					exact
					activeClassName="ui__ hide"
					className="ui__ simple small push-left button"
				>
					←{' '}
					<Trans i18nKey="économieCollaborative.retourAccueil">
						Retour à la selection d'activités
					</Trans>
				</NavLink>
			</div>
			<StoreProvider
				reducer={reducer}
				localStorageKey="app::économie-collaborative:v1"
			>
				<Switch>
					<Route
						exact
						path={indexPath}
						component={ActivitésSelection}
					/>
					<Route
						path={sitePaths.simulateurs.économieCollaborative.votreSituation}
						component={VotreSituation}
					/>
					<Route
						path={sitePaths.simulateurs.économieCollaborative.index + '/:title'}
						component={Activité}
					/>
				</Switch>
			</StoreProvider>
		</>
	)
}
