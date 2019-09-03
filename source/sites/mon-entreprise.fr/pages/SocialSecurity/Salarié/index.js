import withSitePaths from 'Components/utils/withSitePaths'
import { compose } from 'ramda'
import React from 'react'
import { withTranslation } from 'react-i18next'
import { Route, Switch } from 'react-router'
import HeuresSupplémentaires from './HeuresSupplémentaires'
import Salarié from './Salarié'

export default compose(
	withSitePaths,
	withTranslation()
)(({ sitePaths }) => (
	<Switch>
		<Route
			path={sitePaths.sécuritéSociale.salarié.index}
			exact
			component={Salarié}
		/>
		<Route
			path={sitePaths.sécuritéSociale.salarié.heuresSupplémentaires}
			component={HeuresSupplémentaires}
		/>
	</Switch>
))
