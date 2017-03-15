import React, { Component } from 'react'
import classNames from 'classnames'
import {Link} from 'react-router'
import {connect} from 'react-redux'

let fmt = new Intl.NumberFormat('fr-FR').format
let humanFigure = decimalDigits => value => fmt(value.toFixed(decimalDigits))

@connect(
	state => ({
		pointedOutObjectives: state.pointedOutObjectives
	})
)
export default class Results extends Component {
	render() {
		let {analysedSituation, pointedOutObjectives} = this.props
			// missingVariables = collectMissingVariables(analysedSituation, 'groupByResult')
		return (
			<section id="results">
				<div id="results-titles">
					<h2>Vos obligations</h2>
					<div>Cliquez pour comprendre chaque calcul &nbsp;<i className="fa fa-hand-o-right" aria-hidden="true"></i></div>
				</div>
				<ul>
					{analysedSituation.map(
						({name, type, 'non applicable si': {nodeValue: nonApplicable}, formule: {nodeValue: computedValue}}) =>
						do {
							let
								unsatisfied = nonApplicable == null || computedValue == null,
								irrelevant = nonApplicable === true,
								pointedOut = pointedOutObjectives.find(objective => objective == name),
								number = nonApplicable == false && computedValue != null

							;<li key={name} className={classNames({unsatisfied, irrelevant, number, pointedOut})}>
								<Link to={"/regle/" + name} className="understand">
									<div className="rule-box">
										<div className="rule-type">
											{type}
										</div>
										<div className="rule-name">
											{name}
										</div>
										<p>
										{irrelevant ?
											"Vous n'êtes pas concerné"
											: unsatisfied ?
												'En attente de vos réponses...'
												: <span className="figure">{humanFigure(2)(computedValue) + '€'}</span>
										}
										</p>
									</div>
								</Link>
								<div className="pointer">•</div>
							</li>
						}
					)}
				</ul>
			</section>
		)
	}
}
