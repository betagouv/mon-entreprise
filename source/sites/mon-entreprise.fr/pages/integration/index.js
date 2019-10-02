import { ScrollToTop } from 'Components/utils/Scroll'
import React from 'react'
import withSitePaths from 'Components/utils/withSitePaths'
import { Route, Switch } from 'react-router'

import Options from './Options'
import Library from './Library'
import Iframe from './Iframe'

export default withSitePaths(function Integration({ sitePaths }) {
	return (
		<>
			<ScrollToTop />
			<div css="color: white; padding: .2rem 0 .1rem .6rem; border-radius: .3rem; background: linear-gradient(135deg,#1A237E, #9198e5); font-weight: 500; margin-bottom: -.6rem">
				Outils pour les développeurs
			</div>
			<Switch>
				<Route exact path={sitePaths.integration.index} component={Options} />
				<Route path={sitePaths.integration.iframe} component={Iframe} />
				<Route path={sitePaths.integration.library} component={Library} />
			</Switch>
		</>
	)
})
