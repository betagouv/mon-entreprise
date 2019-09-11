// Page listing the engine's currently implemented mecanisms and their tests
import knownMecanims from 'Engine/known-mecanisms.yaml'
import { fromPairs, has, toPairs } from 'ramda'
import React from 'react'
import './Mecanisms.css'

let directoryLoader = require.context('../../test/mécanismes/', true, /.yaml$/),
	suites = fromPairs(
		directoryLoader
			.keys()
			.map(key => [
				key.replace(/\/|\.|(yaml)/g, '').replace(/-/g, ' '),
				directoryLoader(key)
			])
	)

export default function Mecanisms() {
	return (
		<div style={{ margin: '1em auto', maxWidth: '45em' }}>
			<p>
				Cette page liste les mécanismes et indique en rouge ceux qui n'ont pas
				de tests. La commande "yarn test" permet de voir ceux qui passent. Ce
				serait bien de pouvoir les faire tourner dans le navigateur en
				partageant le code de mecanisms.test.js
			</p>
			<ul id="mecanisms">
				{toPairs(knownMecanims).map(([name, data]) => (
					<li key={name}>
						{name}
						{suites[name] == null ? (
							<p className="warning">Pas de tests !</p>
						) : (
							<Tests name={name} suites={suites} />
						)}
					</li>
				))}
			</ul>
		</div>
	)
}

function Tests({ suites, name }) {
	let suite = suites[name],
		tests = suite.filter(has('test'))

	return (
		<p>
			{tests.length} {tests.length == 1 ? 'test' : 'tests'}
		</p>
	)
}
