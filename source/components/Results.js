import React, { Component } from 'react'

export default class Results extends Component {
	render() {
		let {analysedSituation} = this.props
		return (
			<section id="results">
				<h2>Vos obligations</h2>
				<ul>
					{analysedSituation.map(({name, type, derived: {missingVariables, computedValue}}) =>
						<li key={name}>
							<h3>{type} {name}</h3>
							<p className="value">
							{missingVariables && missingVariables.length ?
								'Répondez aux questions !'
								: computedValue != null ?
									computedValue + '€'
									: 'Non applicable'
							}
							</p>
						</li>
					)}
				</ul>
			</section>
		)
	}
}
