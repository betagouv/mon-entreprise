import React from 'react'
import './Pages.css'
import './Home.css'
import Simu from '../Simu'
import PreviousSimulationBanner from '../PreviousSimulationBanner'

const Home = () => (
	<div id="home" className="page">
		<PreviousSimulationBanner />
		<Simu />
		<a href="https://beta.gouv.fr" target="_blank" rel="noopener noreferrer">
			<img
				id="marianne"
				src={require('Images/marianne.svg')}
				alt="Un service de l'État français"
			/>
		</a>
	</div>
)

export default Home
