import React from 'react'
import { connect } from 'react-redux'
import { Redirect, Route, Switch } from 'react-router'
import * as Animate from 'Ui/animate'
import { ScrollToElement } from '../../../../components/utils/Scroll'
import AfterRegistration from './AfterRegistration'
import CreationChecklist from './CreationChecklist'
import DefineDirectorStatus from './DirectorStatus'
import Find from './Find'
import Home from './Home'
import Liability from './Liability'
import MainStatus from './MainStatus'
import Microenterprise from './Microenterprise'
import MinorityDirector from './MinorityDirector'
import NumberOfAssociate from './NumberOfAssociate'

const withAnimation = Component => {
	const AnimateRouteComponent = (...props) => (
		<ScrollToElement onlyIfNotVisible>
			<Animate.fromBottom>
				<Component {...props} />
			</Animate.fromBottom>
		</ScrollToElement>
	)
	return AnimateRouteComponent
}

const CreateMyCompany = ({ match, location, companyStatusChoice }) => (
	<>
		<Animate.fromBottom>
			<Switch>
				<Route
					path={match.path + '/create-:status'}
					component={CreationChecklist}
				/>
				<Route path={match.path + '/find'} component={Find} />
				{companyStatusChoice && (
					<Redirect
						exact
						from={match.path}
						to={match.path + '/create-' + companyStatusChoice}
					/>
				)}
				<Route
					path={match.path + '/after-registration'}
					component={AfterRegistration}
				/>
				<Route path={match.path} component={Home} />
			</Switch>
			<Switch location={location}>
				<Route
					path={match.path + '/liability'}
					component={withAnimation(Liability)}
				/>
				<Route
					path={match.path + '/director-status'}
					component={withAnimation(DefineDirectorStatus)}
				/>
				<Route
					path={match.path + '/microenterprise'}
					component={withAnimation(Microenterprise)}
				/>
				<Route
					path={match.path + '/multiple-associates'}
					component={withAnimation(NumberOfAssociate)}
				/>
				<Route
					path={match.path + '/pick-legal-status'}
					component={withAnimation(MainStatus)}
				/>
				<Route
					path={match.path + '/minority-director'}
					component={withAnimation(MinorityDirector)}
				/>
			</Switch>
		</Animate.fromBottom>
	</>
)

export default connect(state => ({
	companyStatusChoice: state.inFranceApp.companyStatusChoice
}))(CreateMyCompany)
