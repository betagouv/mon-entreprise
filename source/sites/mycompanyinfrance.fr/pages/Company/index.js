import React from 'react'
import { Route, Switch } from 'react-router'
import { animated, Transition } from 'react-spring'
import * as Animate from 'Ui/animate'
import DefineDirectorStatus from './DirectorStatus'
import Find from './Find'
import Home from './Home'
import Liability from './Liability'
import MainStatus from './MainStatus'
import Microenterprise from './Microenterprise'
import RegistrationPending from './RegistrationPending'
import NumberOfAssociate from './NumberOfAssociate'
import Register from './Register'

const CreateMyCompany = ({ match, location }) => (
	<>
		<Animate.fromBottom>
			<Switch>
				<Route
					path={match.path + '/register-:status'}
					component={Register}
				/>
				<Route path={match.path + '/registration-pending'} component={RegistrationPending} />

				<Route path={match.path + '/find'} component={Find} />
				<Route path={match.path} component={Home} />
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
								render={props => (
									<animated.div style={style}>
										<Liability {...props} />
									</animated.div>
								)}
							/>
							<Route
								path={match.path + '/director-status'}
								render={props => (
									<animated.div style={style}>
										<DefineDirectorStatus {...props} />
									</animated.div>
								)}
							/>
							<Route
								path={match.path + '/microenterprise'}
								render={props => (
									<animated.div style={style}>
										<Microenterprise {...props} />
									</animated.div>
								)}
							/>
							<Route
								path={match.path + '/multiple-associates'}
								render={props => (
									<animated.div style={style}>
										<NumberOfAssociate {...props} />
									</animated.div>
								)}
							/>
							<Route
								path={match.path + '/pick-legal-status'}
								render={props => (
									<animated.div style={style}>
										<MainStatus {...props} />
									</animated.div>
								)}
							/>
						</Switch>
					)}
				</Transition>
			</div>
		</Animate.fromBottom>
	</>
)

export default CreateMyCompany
