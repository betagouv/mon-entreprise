import React, { Component } from 'react'

export default class Results extends Component {
	render() {
		let {analysedSituation} = this.props
		return (
			<section id="results">
				<h2>Vos obligations</h2>
				<ul>
					{analysedSituation.map(({name, type, derived: [dependencies, value]}) =>
						<li key={name}>
							<h3>{type} {name}</h3>
							<p className="value">
							{dependencies && dependencies.length ?
								'Répondez aux questions !'
								: value != null ?
									value + '€'
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
