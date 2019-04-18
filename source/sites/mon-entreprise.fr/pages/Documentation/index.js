import RulePage from 'Components/RulePage'
import withSitePaths from 'Components/utils/withSitePaths'
import React from 'react'
import { Route } from 'react-router'
import ExampleSituations from './ExampleSituations'
import RulesList from './RulesList'

export default withSitePaths(function Documentation({ sitePaths }) {
	return (
		<>
			<Route exact path={sitePaths.documentation.index} component={RulesList} />
			<Route
				exact
				path={sitePaths.documentation.index + '/exemples'}
				component={ExampleSituations}
			/>
			<Route
				path={sitePaths.documentation.index + '/:name+'}
				component={RulePage}
			/>
		</>
	)
})
