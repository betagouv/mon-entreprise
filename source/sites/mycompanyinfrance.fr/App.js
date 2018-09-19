import TrackPageView from 'Components/utils/TrackPageView'
import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import 'Ui/index.css'
import Provider from '../../Provider'
import {
	persistEverything,
	retrievePersistedState
} from '../../storage/persistEverything'
import './App.css'
import Footer from './layout/Footer/Footer'
import Navigation from './layout/Navigation/Navigation'
import ProgressHeader from './layout/ProgressHeader/ProgressHeader'
import CompanyIndex from './pages/Company'
import HiringProcess from './pages/HiringProcess'
import Landing from './pages/Landing'
import SocialSecurity from './pages/SocialSecurity'
class InFranceRoute extends Component {
	componentDidMount() {
		if (typeof sessionStorage !== 'undefined') {
			sessionStorage['lang'] = 'en'
		}
	}
	render() {
		return (
			<Provider
				basename="infrance"
				language="en"
				initialStore={{ ...retrievePersistedState(), lang: 'en' }}
				onStoreCreated={persistEverything}>
				<TrackPageView />
				<div id="content">
					<Switch>
						<Route exact path="/" component={Landing} />
						<div className="app-container">
							{/* Passing location down to prevent update blocking */}
							<Navigation location={location} />
							<div className="app-content">
								<ProgressHeader />
								<div className="ui__ container" style={{ flex: 1 }}>
									<Route path="/company" component={CompanyIndex} />
									<Route path="/social-security" component={SocialSecurity} />
									<Route path="/hiring-process" component={HiringProcess} />
								</div>
								<Footer />
							</div>
						</div>
					</Switch>
				</div>
			</Provider>
		)
	}
}

let ExportedApp = InFranceRoute

if (process.env.NODE_ENV !== 'production') {
	const { hot } = require('react-hot-loader')
	ExportedApp = hot(module)(InFranceRoute)
}

export default ExportedApp
