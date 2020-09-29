import { ScrollToTop } from 'Components/utils/Scroll'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import React, { useContext } from 'react'
import { Trans } from 'react-i18next'
import { Route, Switch, useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'
import Iframe from './Iframe'
import Library from './Library'
import Options from './Options'

export default function Integration() {
	const sitePaths = useContext(SitePathsContext)
	const { pathname } = useLocation()
	return (
		<>
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
