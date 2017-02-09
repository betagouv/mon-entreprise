import React, { Component } from 'react'
import classNames from 'classnames'

export default class Results extends Component {
	render() {
		let {analysedSituation} = this.props
		return (
			<section id="results">
				<h2>Vos obligations</h2>
				<ul>
					{analysedSituation.map(({name, type, derived: {missingVariables, computedValue}}) =>
						do {
							let
								unsatisfied = missingVariables && missingVariables.length,
								irrelevant = !unsatisfied && computedValue == null;
							<li key={name} className={classNames({unsatisfied, number: !unsatisfied && !irrelevant})}>
								<h3>{type} {name}</h3>
								<p>
								{unsatisfied ?
									'En attente de vos réponses...'
									: irrelevant ?
										"Vous n'êtes pas concernés"
										:computedValue + '€'
								}
								</p>
							</li>
						}
					)}
				</ul>
			</section>
		)
	}
}
