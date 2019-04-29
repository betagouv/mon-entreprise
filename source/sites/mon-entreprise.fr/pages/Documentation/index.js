import RulePage from 'Components/RulePage'
import withSitePaths from 'Components/utils/withSitePaths'
import React from 'react'
import { Route, Switch } from 'react-router'
import ExampleSituations from './ExampleSituations'
import RulesList from './RulesList'

export default withSitePaths(function Documentation({ sitePaths }) {
	return (
		<Switch>
			<Route exact path={sitePaths.documentation.index} component={RulesList} />
			<Route
				exact
				path={sitePaths.documentation.exemples}
				component={ExampleSituations}
			/>
			<Route
				path={sitePaths.documentation.index + '/:name+'}
				component={RulePage}
			/>
		</Switch>
	)
})
