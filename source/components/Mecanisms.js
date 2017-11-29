// Page listing the engine's currently implemented mecanisms and their tests
import React, { Component } from 'react'
import knownMecanims from 'Engine/known-mecanisms.yaml'
import R from 'ramda'

export default class Mecanisms extends Component {
	render() {
		return (
			<ul>
				{R.toPairs(knownMecanims).map(([name, data]) => (
					<li key={name}>{name}</li>
				))}
			</ul>
		)
	}
}
