import { ScrollToTop } from 'Components/utils/Scroll'
import { SitePathsContext } from 'Components/utils/withSitePaths'
import React, { useContext } from 'react'
import { Trans } from 'react-i18next'
import { Route, Switch } from 'react-router'
import { Link } from 'react-router-dom'
import Iframe from './Iframe'
import Library from './Library'
import Options from './Options'

export default function Integration() {
	const sitePaths = useContext(SitePathsContext)
	return (
		<>
			<ScrollToTop />
			<div className="ui__ plain card" css="text-align: center">
				<h2>
					🛠{' '}
					<Link className="ui__ simple button" to={sitePaths.integration.index}>
						<Trans>Outils pour les développeurs</Trans>
					</Link>{' '}
					🛠
				</h2>
			</div>
			<Switch>
				<Route exact path={sitePaths.integration.index} component={Options} />
				<Route path={sitePaths.integration.iframe} component={Iframe} />
				<Route path={sitePaths.integration.library} component={Library} />
			</Switch>
		</>
	)
}
