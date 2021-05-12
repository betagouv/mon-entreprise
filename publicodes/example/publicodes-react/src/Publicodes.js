import Engine from 'publicodes'
import { Documentation, getDocumentationSiteMap } from 'publicodes-react'
import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Link } from 'react-router-dom'

const rulesURL = require('./CO2-douche.publicodes.yaml').default
async function initEngine(setEngine) {
	const response = await fetch(rulesURL)
	const rules = await response.text()
	setEngine(new Engine(rules))
}

export default function Publicodes() {
	const [engine, setEngine] = useState(null)
	useEffect(() => initEngine(setEngine), [setEngine])

	if (!engine) {
		return 'Chargement des règles de calculs en cours...'
	}

	return (
		<Router>
			<div style={{ margin: 'auto', maxWidth: '800px' }}>
				<Documentation engine={engine} documentationPath={''} />
				<h2>Toutes les règles</h2>
				<ul>
					{Object.entries(
						getDocumentationSiteMap({ engine, documentationPath: '' })
					).map(([link, name]) => (
						<li key={link}>
							<Link to={link}>{name}</Link>
						</li>
					))}
				</ul>
			</div>
		</Router>
	)
}
