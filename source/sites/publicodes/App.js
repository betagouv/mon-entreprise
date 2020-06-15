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
import Scenarios from './Scenarios'
import Simulateur from './Simulateur'
import sitePaths from './sitePaths'
import { StoreProvider } from './StoreContext'

let Studio = React.lazy(() => import('./Studio'))

class App extends Component {
	render() {
		return (
			<Provider
				basename="publicodes"
				rulesURL="https://ecolab-data.netlify.app/co2.json"
				sitePaths={sitePaths()}
				reduxMiddlewares={[]}
			>
				<StoreProvider>
					<div css="background: yellow; text-align: center; color: black; ">
						Attention, ceci est version{' '}
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
							<Link to="/">
								<img
									css={`
										height: 3rem;
										@media (max-width: 800px) {
											height: 2rem;
										}
									`}
									src="https://ecolab-transport.netlify.com/images/ecolab.png"
								/>
							</Link>
						</nav>
						<Switch>
							<Route exact path="/" component={Landing} />
							<Route path="/documentation/:name+" component={RulePage} />
							<Route path="/documentation" component={RulesList} />
							<Route path="/simulateur/:name+" component={Simulateur} />
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
