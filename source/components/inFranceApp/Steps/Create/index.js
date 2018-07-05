import React from 'react'
import { Route, Switch } from 'react-router'
import { animated, Transition } from 'react-spring'
import * as Animate from '../../animate'
import DefineDirectorStatus from './DirectorStatus'
import Home from './Home'
import LegalSetup from './LegalSetup'
import MainStatus from './MainStatus'
import NumberOfAssociate from './NumberOfAssociate'
import RegisteringProcess from './RegisteringProcess'

const CreateMyCompany = ({ match, location }) => (
	<>
		<Animate.fromBottom>
			<Switch>
				<Route
					path={match.path + '/register-:status'}
					component={RegisteringProcess}
				/>
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
								path={match.path + '/choose-legal-setup'}
								render={props => (
									<animated.div style={style}>
										<LegalSetup {...props} />
									</animated.div>
								)}
							/>
							<Route
								path={match.path + '/define-director-status'}
								render={props => (
									<animated.div style={style}>
										<DefineDirectorStatus {...props} />
									</animated.div>
								)}
							/>
							<Route
								path={match.path + '/number-of-associate'}
								render={props => (
									<animated.div style={style}>
										<NumberOfAssociate {...props} />
									</animated.div>
								)}
							/>
							<Route
								path={match.path + '/set-legal-status'}
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
