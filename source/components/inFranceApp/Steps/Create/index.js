import React from 'react'
import { Route, Switch } from 'react-router'
import * as Animate from '../../animate'
import DirectorStatus from './DirectorStatus'
import Home from './Home'
import LegalSetup from './LegalSetup'

const CreateMyCompany = ({ match }) => (
	<Animate.fromBottom>
		<Route path={match.path} component={Home} />
		<Switch>
			<Route path={match.path + '/choose-legal-setup'} component={LegalSetup} />
			<Route
				path={match.path + '/define-director-status'}
				component={DirectorStatus}
			/>
		</Switch>
	</Animate.fromBottom>
)

export default CreateMyCompany
