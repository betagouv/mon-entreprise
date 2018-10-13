import PreviousSimulationBanner from 'Components/PreviousSimulationBanner'
import Simu from 'Components/Simu'
import React from 'react'
import Marianne from 'Images/marianne.svg'
import Simulateur from './../images/logo/logo-simulateur.svg'
import URSSAF from 'Images/urssaf.svg'
import './Home.css'
import { inIframe } from '../../../utils'
import emoji from 'react-easy-emoji'
import translate from 'react-i18next/dist/commonjs/translate'
import withLanguage from 'Components/utils/withLanguage'

const Home = translate()(
	withLanguage(({ language }) => (
		<div id="home" className="ui__ container">
			<PreviousSimulationBanner />
			<Simu />
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
			<p
				style={{
					textAlign: 'center',
					width: '60%',
					margin: '0 auto',
					lineHeight: '1.3em',
					color: '#333'
				}}>
				{emoji('🚀 ')}
				{language == 'fr' ? (
					<span>
						{' '}
						Découvrez notre nouveau guide de création d'entreprise sur{' '}
						<a href="https://mycompanyinfrance.fr">mycompanyinfrance.fr</a>{' '}
						(anglais)
					</span>
				) : (
					<span>
						Discover{' '}
						<a href="https://mycompanyinfrance.fr">mycompanyinfrance.fr</a>, our
						new guide to start your business in France
					</span>
				)}
			</p>
		</div>
	))
)

export default Home
