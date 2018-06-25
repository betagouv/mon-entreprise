import React from 'react'
import { Route } from 'react-router'
import * as Animate from '../../animate'
import Home from './Home'
import LegalSetup from './LegalSetup'

const CreateMyCompany = ({ match }) => (
	<Animate.fromBottom>
		<Route path={match.url} component={Home} />
		<Route path={match.url + '/choose-legal-setup'} component={LegalSetup} />
	</Animate.fromBottom>
)

export default CreateMyCompany
