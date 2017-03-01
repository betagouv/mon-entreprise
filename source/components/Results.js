import React, { Component } from 'react'
import classNames from 'classnames'
import {Link} from 'react-router'

export default class Results extends Component {
	render() {
		let {analysedSituation} = this.props
			// missingVariables = collectMissingVariables(analysedSituation, 'groupByResult')
		return (
			<section id="results">
				<h2>Vos obligations</h2>
				{console.log('analysedSituation', analysedSituation)}
				<ul>
					{analysedSituation.map(
						({name, type, 'non applicable si': {nodeValue: nonApplicable}, formule: {nodeValue: computedValue}}) =>
						do {
							let
								unsatisfied = nonApplicable == null || computedValue == null,
								irrelevant = nonApplicable === true;

							<li key={name} className={classNames({unsatisfied, number: !unsatisfied && !irrelevant})}>
								<h3>{type} {name}</h3>
								<p>
								{irrelevant ?
									"Vous n'êtes pas concernés"
									: unsatisfied ?
										'En attente de vos réponses...'
										:computedValue + '€'
								}
								</p>
								<Link to={"/regle/" + name} className="understand">
									<button>
										Comprendre <i className="fa fa-cogs" aria-hidden="true"></i>
									</button>
								</Link>
							</li>
						}
					)}
				</ul>
			</section>
		)
	}
}
