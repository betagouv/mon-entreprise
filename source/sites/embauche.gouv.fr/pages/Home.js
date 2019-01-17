import PreviousSimulationBanner from 'Components/PreviousSimulationBanner'
import { SalarySimulation } from '../../mycompanyinfrance.fr/pages/SocialSecurity/Salarié'
import salariéConfig from 'Components/simulationConfigs/salarié.yaml'
import withSimulationConfig from 'Components/simulationConfigs/withSimulationConfig'
import Marianne from 'Images/marianne.svg'
import URSSAF from 'Images/urssaf.svg'
import React from 'react'
import { inIframe } from '../../../utils'
import Simulateur from './../images/logo/logo-simulateur.svg'
import './Home.css'

const Home = () => (
	<div id="home" className="ui__ container">
		<PreviousSimulationBanner />
		<SalarySimulation />
		<div id="logos">
			<a
				id="marianne"
				href="https://beta.gouv.fr"
				target="_blank"
				rel="noopener noreferrer">
				<img src={Marianne} alt="Un service de l'État français" />
			</a>
			<a
				id="urssaf"
				href="https://www.urssaf.fr"
				target="_blank"
				rel="noopener noreferrer">
				<img src={URSSAF} alt="Un service des URSSAF" />
			</a>
			{inIframe() && (
				<a
					id="embauche"
					href="https://embauche.beta.gouv.fr"
					target="_blank"
					rel="noopener noreferrer">
					<img src={Simulateur} alt="Developpé par embauche.beta.gouv.fr" />
				</a>
			)}
		</div>
	</div>
)

export default withSimulationConfig(salariéConfig)(Home)
