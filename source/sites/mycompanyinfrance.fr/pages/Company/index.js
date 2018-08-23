import React from 'react'
import { Route, Switch, Redirect } from 'react-router'
import { animated, Transition } from 'react-spring'
import * as Animate from 'Ui/animate'
import DefineDirectorStatus from './DirectorStatus'
import Find from './Find'
import Home from './Home'
import Liability from './Liability'
import MainStatus from './MainStatus'
import { connect } from "react-redux";
import MinorityDirector from './MinorityDirector'
import Microenterprise from './Microenterprise'
import NumberOfAssociate from './NumberOfAssociate'
import CreationChecklist from './CreationChecklist'


const withRouteAnimation = style => AnimatedComponent => {
	const withRouteAnimation = props => (
		<animated.div style={style}>
			<AnimatedComponent {...props} />
		</animated.div>
	)
	return withRouteAnimation;
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
				{companyStatusChoice ? 
					<Redirect from={match.path} to={match.path + '/create-' + companyStatusChoice} /> :
					<Route path={match.path} component={Home} />
				}
			</Switch>
			<div className="ui__ route-trans">
				<Transition
					from={{
						opacity: 0,
						transform: 'translateX(100%)'
					}}
					native
					keys={location.pathname}
					enter={{
						opacity: 1,
						transform: 'translateX(0%)'
					}}
					leave={{
						opacity: 0,
						position: 'absolute',
						transform: 'translateX(-100%)'
					}}>
					{style => (
						<Switch location={location}>
							<Route
								path={match.path + '/liability'}
								component={withRouteAnimation(style)(Liability)}
							/>
							<Route
								path={match.path + '/director-status'}
								component={withRouteAnimation(style)(DefineDirectorStatus)}
							/>
							<Route
								path={match.path + '/microenterprise'}
								component={withRouteAnimation(style)(Microenterprise)}
							/>
							<Route
								path={match.path + '/multiple-associates'}
								component={withRouteAnimation(style)(NumberOfAssociate)}
							/>
							<Route
								path={match.path + '/pick-legal-status'}
								component={withRouteAnimation(style)(MainStatus)}
							/>
							<Route
								path={match.path + '/minority-director'}
								component={withRouteAnimation(style)(MinorityDirector)}
							/>
						</Switch>
					)}
				</Transition>
			</div>
		</Animate.fromBottom>
	</>
)

export default connect(state => ({ companyStatusChoice: state.inFranceApp.companyStatusChoice}))(CreateMyCompany)
