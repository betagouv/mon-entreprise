// Page listing the engine's currently implemented mecanisms and their tests
import React, { Component } from 'react'
import knownMecanims from 'Engine/known-mecanisms.yaml'
import R from 'ramda'
import './Mecanisms.css'

let directoryLoader = require.context('../../test/mécanismes/', true, /.yaml$/),
	suites = R.fromPairs(
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
						{suites[name] == null ? (
							<p className="warning">Pas de tests !</p>
						) : (
							<Tests name={name} suites={suites} />
						)}
					</li>
				))}
			</ul>
		)
	}
}

class Tests extends Component {
	render() {
		let { suites, name } = this.props,
			suite = suites[name],
			tests = suite.filter(R.has('test'))

		return (
			<p>
				{tests.length} {tests.length == 1 ? 'test' : 'tests'}
			</p>
		)
	}
}
