import Engine from 'publicodes'
import { Documentation } from 'publicodes-react'
import { useEffect, useState } from 'react'
import { Router } from 'react-router-dom'

const rulesURL = require('./CO2-douche.publicodes.md')

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
			<Documentation engine={engine} documentationPath={'/'} />
		</Router>
	)
}
