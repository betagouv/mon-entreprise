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
import Landing from './Landing'
import CompanyIndex from './pages/Company'
import Footer from './pages/Footer/Footer'
import Header from './pages/Header/Header'
import HiringProcess from './pages/HiringProcess'
import Navigation from './pages/Navigation/Navigation'
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
				<Header />
				<div id="content">
					<Switch>
						<Route exact path="/" component={Landing} />
						<div style={{ display: 'flex', flex: 1 }}>
							{/* Passing location down to prevent update blocking */}
							<Navigation location={location} />
							<div className="ui__ container">
								<Route path="/company" component={CompanyIndex} />
								<Route path="/social-security" component={SocialSecurity} />
								<Route path="/hiring-process" component={HiringProcess} />
							</div>
							<div style={{ flex: 1 }} />
						</div>
					</Switch>
				</div>
				<Footer />
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
