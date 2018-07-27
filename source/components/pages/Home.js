import React from 'react'
import './Pages.css'
import './Home.css'
import Simu from '../Simu'
import PreviousSimulationBanner from '../PreviousSimulationBanner'

const Home = () => (
	<div id="home" className="page">
		<PreviousSimulationBanner />
		<Simu />
		<div id="logos">
			<a
				id="marianne"
				href="https://beta.gouv.fr"
				target="_blank"
				rel="noopener noreferrer">
				<img
					src={require('Images/marianne.svg')}
					alt="Un service de l'État français"
				/>
			</a>
			<a
				id="urssaf"
				href="https://www.urssaf.fr"
				target="_blank"
				rel="noopener noreferrer">
				<img src={require('Images/urssaf.svg')} alt="Un service des URSSAF" />
			</a>
		</div>
	</div>
)

export default Home
