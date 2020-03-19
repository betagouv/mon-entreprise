import { ScrollToTop } from 'Components/utils/Scroll'
import { SitePathsContext } from 'Components/utils/withSitePaths'
import React, { useContext } from 'react'
import { Route, Switch } from 'react-router'
import { useLocation } from 'react-router-dom'
import ChômagePartiel from './ChômagePartiel'

export default function Simulateurs() {
	const sitePaths = useContext(SitePathsContext)
	const { state, pathname } = useLocation()

	return (
		<>
			<ScrollToTop key={pathname} />
			{/* {pathname !== sitePaths.coronavirus.index && (
				<div css="transform: translateY(2rem);">
					<Link
						to={sitePaths.coronavirus.index}
						className="ui__ simple small push-left button"
					>
						← <Trans>Retour</Trans>
					</Link>
				</div>
			)} */}
			<Switch>
				{/* <Route exact path={sitePaths.coronavirus.index} component={Home} /> */}
				<Route
					path={sitePaths.coronavirus.chômagePartiel}
					component={ChômagePartiel}
				/>
			</Switch>
		</>
	)
}
