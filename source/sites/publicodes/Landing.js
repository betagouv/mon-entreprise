import React from 'react'
import ContributionButton from './ContributionButton'
import DocumentationButton from './DocumentationButton'
import Suggestions from './Suggestions'
import { Link } from 'react-router-dom'

export default () => {
	return (
		<div
			css={`
				h1 {
					margin-top: 1rem;
					font-size: 140%;
					line-height: 1.2em;
				}
				> a {
					margin: 2rem;
				}
				text-align: center;
			`}
		>
			<h1>Connais-tu ton empreinte sur le climat ?</h1>
			<Link to="/simulateur/micmac" className="ui__ button">
				Faire le test
			</Link>
			<p>
				Ce simulateur vous permet d'évaluer votre empreinte climat personnelle,
				et de la situer par rapport aux objectifs climatiques. C'est une
				nouvelle version du simulateur{' '}
				<a href="http://avenirclimatique.org/micmac/simulationCarbone.php">
					MicMac{' '}
				</a>{' '}
				développé de l'association Avenir Climatique.
			</p>
			<DocumentationButton />
		</div>
	)
}
