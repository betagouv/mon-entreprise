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
import LangSwitcher from 'Components/LangSwitcher'
import { Trans, translate } from 'react-i18next'

const Footer = ({ colours: { colour } }) => (
	<div className="footer-container">
		<PageFeedback blacklist={feedbackBlacklist} />
		<footer className="footer" style={{ backgroundColor: `${colour}22` }}>
			<div className="ui__ container">
				<div id="footerIcons">
					<a href="https://www.urssaf.fr">
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
					<Trans i18nKey="piedDePage">
						Ce site est développé par l'
						<a href="https://www.urssaf.fr">URSSAF</a> et{' '}
						<a href="https://beta.gouv.fr">beta.gouv.fr</a>.
					</Trans>
				</p>
				<p className="ui__ notice" style={{ textAlign: 'center' }}>
					<LegalNotice />
					{'  •  '}
					<Privacy />
					{'  •  '}
					<LangSwitcher />
				</p>
			</div>
		</footer>
	</div>
)

export default compose(
	withRouter,
	withColours,
	translate()
)(Footer)
