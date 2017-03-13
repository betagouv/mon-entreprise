import React, { Component } from 'react'
import classNames from 'classnames'
import {Link} from 'react-router'

let fmt = new Intl.NumberFormat('fr-FR').format
let humanFigure = decimalDigits => value => fmt(value.toFixed(decimalDigits))

export default class Results extends Component {
	render() {
		let {analysedSituation} = this.props
			// missingVariables = collectMissingVariables(analysedSituation, 'groupByResult')
		return (
			<section id="results">
				<h2>Vos obligations</h2>
				<ul>
					{analysedSituation.map(
						({name, type, 'non applicable si': {nodeValue: nonApplicable}, formule: {nodeValue: computedValue}}) =>
						do {
							let
								unsatisfied = nonApplicable == null || computedValue == null,
								irrelevant = nonApplicable === true;

							<li key={name} className={classNames({unsatisfied, number: !unsatisfied && !irrelevant})}>
								<div className="rule-box">
									<div className="rule-type">
										{type}
									</div>
									<div className="rule-name">
										{name}
									</div>
									<p>
									{irrelevant ?
										"Vous n'êtes pas concernés"
										: unsatisfied ?
											'En attente de vos réponses...'
											: <span className="figure">{humanFigure(2)(computedValue) + '€'}</span>
									}
									</p>
								</div>
								<Link to={"/regle/" + name} className="understand">
									Pourquoi ? <i className="fa fa-cogs" aria-hidden="true"></i>
								</Link>
							</li>
						}
					)}
				</ul>
			</section>
		)
	}
}
