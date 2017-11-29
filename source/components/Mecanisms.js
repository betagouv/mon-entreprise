// Page listing the engine's currently implemented mecanisms and their tests
import React, { Component } from 'react'
import knownMecanims from 'Engine/known-mecanisms.yaml'
import R from 'ramda'
import './Mecanisms.css'

let directoryLoader = require.context('../../test/mécanismes/', true, /.yaml$/),
	tests = R.fromPairs(
		directoryLoader
			.keys()
			.map(key => [
				key.replace(/\/|\.|(yaml)/g, '').replace(/-/g, ' '),
				directoryLoader(key)
			])
	)

export default class Mecanisms extends Component {
	render() {
		return (
			<ul id="mecanisms">
				{R.toPairs(knownMecanims).map(([name, data]) => (
					<li key={name}>
						{name}
						{tests[name] == null ? (
							<p className="warning">Pas de tests !</p>
						) : (
							<p>nombre de tests {tests[name].length}</p>
						)}
					</li>
				))}
			</ul>
		)
	}
}
