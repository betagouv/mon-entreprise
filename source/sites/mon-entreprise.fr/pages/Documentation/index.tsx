import RulePage from 'Components/RulePage'
import { SitePathsContext } from 'Components/utils/withSitePaths'
import React, { useContext } from 'react'
import { Route, Switch } from 'react-router'
import RulesList from './RulesList'

export default function Documentation() {
	const sitePaths = useContext(SitePathsContext)
	return (
		<Switch>
			<Route exact path={sitePaths.documentation.index} component={RulesList} />
			<Route
				path={sitePaths.documentation.index + '/:name+'}
				component={RulePage}
			/>
		</Switch>
	)
}
