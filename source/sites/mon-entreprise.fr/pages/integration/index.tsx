import { ScrollToTop } from 'Components/utils/Scroll'
import { SitePathsContext } from 'Components/utils/withSitePaths'
import React, { useContext } from 'react'
import { Trans } from 'react-i18next'
import { Route, Switch } from 'react-router'
import Iframe from './Iframe'
import Library from './Library'
import Options from './Options'

export default function Integration() {
	const sitePaths = useContext(SitePathsContext)
	return (
		<>
			<ScrollToTop />
			<div css="color: white; padding: .2rem 0 .1rem .6rem; border-radius: .3rem; background: linear-gradient(135deg,#1A237E, #9198e5); font-weight: 500; margin-bottom: -.6rem">
				<Trans>Outils pour les développeurs</Trans>
			</div>
			<Switch>
				<Route exact path={sitePaths.integration.index} component={Options} />
				<Route path={sitePaths.integration.iframe} component={Iframe} />
				<Route path={sitePaths.integration.library} component={Library} />
			</Switch>
		</>
	)
}
