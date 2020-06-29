import Route404 from 'Components/Route404'
import RulePage from 'Components/RulePage'
import React, { Component, Suspense } from 'react'
import { Link, Route, Switch } from 'react-router-dom'
import 'Ui/index.css'
import Provider from '../../Provider'
import RulesList from '../mon-entreprise.fr/pages/Documentation/RulesList'
import About from './About'
import Contribution from './Contribution'
import Landing from './Landing'
import Simulateur from './Simulateur'
import Fin from './Fin'
import sitePaths from './sitePaths'
import { StoreProvider } from './StoreContext'
import {
	persistSimulation,
	retrievePersistedSimulation,
} from '../../storage/persistSimulation'

let Studio = React.lazy(() => import('./Studio'))

class App extends Component {
	render() {
		const urlParams = new URLSearchParams(window.location.search)
		/* This enables loading the rules of a branch,
		 * to showcase the app as it would be once this branch of -data  has been merged*/
		const branch = urlParams.get('branch')
		const pullRequestNumber = urlParams.get('PR')
		return (
			<Provider
				basename="publicodes"
				rulesURL={`https://${
					branch
						? `${branch}--`
						: pullRequestNumber
						? `deploy-preview-${pullRequestNumber}--`
						: ''
				}ecolab-data.netlify.app/co2.json`}
				dataBranch={branch || pullRequestNumber}
				sitePaths={sitePaths()}
				reduxMiddlewares={[]}
				onStoreCreated={(store) => {
					//persistEverything({ except: ['rules', 'simulation'] })(store)
					persistSimulation(store)
				}}
				initialStore={{
					//...retrievePersistedState(),
					previousSimulation: retrievePersistedSimulation(),
				}}
			>
				<StoreProvider>
					<div css="background: yellow; text-align: center; color: black; ">
						Attention, version{' '}
						<span
							css={`
								display: inline-block;
								background: rgb(131, 167, 201) none repeat scroll 0% 0%;
								padding: 0px 0.3rem;
								text-align: center;
								font-size: 80%;
								color: white;
								border-radius: 0.6rem;
								font-weight: 900;
								transform: rotate(15deg);
								animation-duration: 2s;
								animation-name: slidein;
								margin: 0 0.4rem;

								@keyframes slidein {
									from {
										font-size: 150%;
										transform: rotate(0deg);
									}

									to {
										font-size: 80%;
										transform: rotate(15deg);
									}
								}
							`}
						>
							beta
						</span>
						<Link to="/contribuer">faites-nous vos retours !</Link>
					</div>
					<div className="ui__ container">
						<nav css="display: flex; justify-content: center; margin-top: .6rem">
							<Link
								to="/"
								css={`
									display: flex;
									align-items: center;
									text-decoration: none;
									font-size: 130%;
								`}
							>
								<img
									css={`
										height: 3rem;
										@media (max-width: 800px) {
											height: 2rem;
										}
									`}
									alt="Ecolab"
									src="https://ecolab-transport.netlify.com/images/ecolab.png"
								/>{' '}
								- Nos gestes climat
							</Link>
						</nav>
						<Switch>
							<Route exact path="/" component={Landing} />
							<Route path="/documentation/:name+" component={RulePage} />
							<Route path="/documentation" component={RulesList} />
							<Route path="/simulateur/:name+" component={Simulateur} />
							<Route path="/fin/:score" component={Fin} />
							<Route path="/contribuer/:input?" component={Contribution} />
							<Route path="/à-propos" component={About} />
							<Route
								path="/studio"
								component={() => (
									<Suspense fallback={<div>Chargement de l'éditeur ...</div>}>
										<Studio />
									</Suspense>
								)}
							/>
							<Route component={Route404} />
						</Switch>
					</div>
				</StoreProvider>
			</Provider>
		)
	}
}

export default App
