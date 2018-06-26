import React from 'react'
import { Route, Switch } from 'react-router'
import * as Animate from '../../animate'
import DefineDirectorStatus from './DirectorStatus'
import Home from './Home'
import LegalSetup from './LegalSetup'
import MainStatus from './MainStatus'
import NumberOfAssociate from './NumberOfAssociate'

const CreateMyCompany = ({ match }) => (
	<Animate.fromBottom>
		<Route path={match.path} component={Home} />
		<Switch>
			<Route path={match.path + '/choose-legal-setup'} component={LegalSetup} />
			<Route
				path={match.path + '/define-director-status'}
				component={DefineDirectorStatus}
			/>
			<Route
				path={match.path + '/number-of-associate'}
				component={NumberOfAssociate}
			/>
			<Route path={match.path + '/set-legal-status'} component={MainStatus} />
		</Switch>
	</Animate.fromBottom>
)

export default CreateMyCompany
