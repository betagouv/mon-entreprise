import React from 'react'
import ContributionButton from './ContributionButton'
import DocumentationButton from './DocumentationButton'
import Suggestions from './Suggestions'
import { Link } from 'react-router-dom'
import Illustration from 'Images/illustration-micmac.png'

export default () => {
	return (
		<div
			css={`
				h1 {
					margin-top: 0.3rem;
					font-size: 140%;
					line-height: 1.2em;
				}
				> div > a {
				}
				text-align: center;
				> img {
					width: 70%;
					min-width: 25rem;
				}
			`}
		>
			<h1>Connais-tu ton empreinte sur le climat ?</h1>
			<img src={Illustration} />
			<div css="margin: 1rem 0 2rem;">
				<Link to="/simulateur/micmac" className="ui__ plain button">
					Faire le test
				</Link>
			</div>
			<p>
				Ce simulateur vous permet d'évaluer votre empreinte climat personnelle,
				puis de la situer par rapport aux objectifs climatiques. Il est basé sur
				le modèle{' '}
				<a href="http://avenirclimatique.org/micmac/simulationCarbone.php">
					MicMac{' '}
				</a>{' '}
				de l'association Avenir Climatique.
			</p>
			<DocumentationButton />
			<footer
				css={`
					margin-top: 1rem;
					display: flex;
					align-items: center;
					justify-content: center;
					flex-wrap: wrap;
					img {
						margin-left: 1rem;
					}
					p {
						width: 100%;
					}
				`}
			>
				<p>Données bientôt validées par</p>
				<img
					css="height: 3rem"
					src="https://www.ademe.fr/sites/all/themes/ademe/logo.png"
				/>
				<img
					css="height: 2rem"
					src="https://www.associationbilancarbone.fr/wp-content/themes/abc/assets/images/brand/abc_main_logo.svg"
				/>
			</footer>
		</div>
	)
}
