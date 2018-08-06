import withColours from 'Components/utils/withColours'
import urssafSvg from 'Images/urssaf.svg'
import React from 'react'
import './Footer.css'
import betaGouvSvg from './logo-betagouv.svg'

const Footer = ({ colours: { colour } }) => (
	<footer className="footer" style={{ backgroundColor: `${colour}22` }}>
		<div className="ui__ container">
			<p>
				Un service fourni par <a href="https://urssaf.fr">l'URSSAF</a> et incubé
				par <a href="https://beta.gouv.fr">beta.gouv.fr</a>
			</p>
			<a href="https://beta.gouv.fr">
				<img
					src={betaGouvSvg}
					alt="un service de l'état français incubé par beta.gouv.fr"
				/>
			</a>
			<a href="https://urssaf.fr">
				<img src={urssafSvg} alt="un service fourni par l'URSSAF" />
			</a>
		</div>
	</footer>
)

export default withColours(Footer)
