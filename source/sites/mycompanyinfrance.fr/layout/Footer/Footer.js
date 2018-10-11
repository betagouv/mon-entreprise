import PageFeedback from 'Components/Feedback/PageFeedback'
import LegalNotice from 'Components/LegalNotice'
import withColours from 'Components/utils/withColours'
import urssafSvg from 'Images/urssaf.svg'
import { compose } from 'ramda'
import React from 'react'
import { withRouter } from 'react-router'
import { feedbackBlacklist } from '../../config'
import './Footer.css'
import betaGouvSvg from './logo-betagouv.svg'
import Privacy from './Privacy'

const Footer = ({ colours: { colour } }) => (
	<div className="footer-container">
		<PageFeedback blacklist={feedbackBlacklist} />
		<footer className="footer" style={{ backgroundColor: `${colour}22` }}>
			<div className="ui__ container">
				<div id="footerIcons">
					<a href="https://urssaf.fr">
						<img src={urssafSvg} alt="un service fourni par l'URSSAF" />
					</a>
					<a href="https://beta.gouv.fr">
						<img
							src={betaGouvSvg}
							alt="un service de l’Etat français incubé par beta.gouv.fr"
						/>
					</a>
				</div>
				<p className="ui__ notice">
					This website is provided by the{' '}
					<a href="https://www.urssaf.fr">URSSAF</a>, the French social security
					contributions collector, and the government’s public startup
					incubator, <a href="https://beta.gouv.fr">beta.gouv.fr</a>.
				</p>
				<p className="ui__ notice" style={{ textAlign: 'center' }}>
					<LegalNotice />
					{'  •  '}
					<Privacy />
				</p>
			</div>
		</footer>
	</div>
)

export default compose(
	withRouter,
	withColours
)(Footer)
