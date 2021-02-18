import { ScrollToTop } from 'Components/utils/Scroll'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { useContext } from 'react'
import { Trans } from 'react-i18next'
import { Link, Route, Switch, useLocation } from 'react-router-dom'
import { TrackChapter } from '../../ATInternetTracking'
import Iframe from './Iframe'
import Library from './Library'
import Options from './Options'

export default function Integration() {
	const sitePaths = useContext(SitePathsContext)
	const { pathname } = useLocation()
	return (
		<>
			<TrackChapter chapter1="integration" />
			<ScrollToTop />
			{pathname !== sitePaths.integration.index && (
				<div className="ui__ card dark-bg" css="text-align: center">
					🛠{' '}
					<Link className="ui__ simple button" to={sitePaths.integration.index}>
						<Trans>Outils pour les développeurs</Trans>
					</Link>{' '}
					🛠
				</div>
			)}
			<Switch>
				<Route exact path={sitePaths.integration.index} component={Options} />
				<Route path={sitePaths.integration.iframe} component={Iframe} />
				<Route path={sitePaths.integration.library} component={Library} />
			</Switch>
		</>
	)
}
