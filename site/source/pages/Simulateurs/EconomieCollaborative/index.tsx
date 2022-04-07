import { useIsEmbedded } from '@/components/utils/embeddedContext'
import { SitePathsContext } from '@/components/utils/SitePathsContext'
import { Link } from '@/design-system/typography/link'
import { useContext } from 'react'
import { Trans } from 'react-i18next'
import { Route, Switch } from 'react-router-dom'
import { TrackChapter } from '../../../ATInternetTracking'
import useSimulatorsData from '../metadata'
import Activité from './Activité'
import ActivitésSelection from './ActivitésSelection'
import { StoreProvider } from './StoreContext'
import VotreSituation from './VotreSituation'

export default function ÉconomieCollaborative() {
	const sitePaths = useContext(SitePathsContext)
	const iframePath =
		useSimulatorsData()['économie-collaborative'].iframePath ?? ''
	const indexPath = useIsEmbedded()
		? '/iframes/' + iframePath
		: sitePaths.simulateurs.économieCollaborative.index

	return (
		<TrackChapter chapter1="simulateurs" chapter2="economie_collaborative">
			<div css="transform: translateY(2rem)">
				<Link exact activeStyle={{ display: 'none' }} to={indexPath}>
					←{' '}
					<Trans i18nKey="économieCollaborative.retourAccueil">
						Retour à la selection d'activités
					</Trans>
				</Link>
			</div>
			<StoreProvider localStorageKey="app::économie-collaborative:v1">
				<Switch>
					<Route exact path={indexPath} component={ActivitésSelection} />
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
		</TrackChapter>
	)
}
