import TrackPageView from 'Components/utils/TrackPageView'
import React, { Component } from 'react'
import Loadable from 'react-loadable'
import { Route, Switch } from 'react-router-dom'
import 'Ui/index.css'
import Provider from '../../Provider'
import {
	persistEverything,
	retrievePersistedState
} from '../../storage/persistEverything'
import './App.css'
import Landing from './Landing'
import CreateMyCompany from './pages/Company'
import Footer from './pages/Footer/Footer'
import HiringProcess from './pages/HiringProcess'
import SocialSecurity from './pages/SocialSecurity'

const StepsHeader = Loadable({
	loader: () => import('./pages/Header/StepsHeader'),
	loading: () => null
})

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
						<>
							{/* Passing location down to prevent update blocking */}
							<StepsHeader location={location} />
							<div className="ui__ container">
								<Route path="/company" component={CreateMyCompany} />
								<Route path="/social-security" component={SocialSecurity} />
								<Route path="/hiring-process" component={HiringProcess} />
							</div>
						</>
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
