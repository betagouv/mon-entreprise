import React, { Component } from 'react'
import classNames from 'classnames'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import R from 'ramda'
import './Results.css'

let fmt = new Intl.NumberFormat('fr-FR').format
let humanFigure = decimalDigits => value => fmt(value.toFixed(decimalDigits))

@connect(
	state => ({
		pointedOutObjectives: state.pointedOutObjectives,
		analysedSituation: state.analysedSituation,
		conversationStarted: !R.isEmpty(state.form)
	})
)
export default class Results extends Component {
	render() {
		let {analysedSituation, pointedOutObjectives, conversationStarted} = this.props
		// On travaille pour l'instant sur un objectif qui est une somme de plusieurs variables, et c'est ces variables que nous affichons comme résultats. D'où ce chemin :
		let explanation = R.path(['formule', 'explanation', 'explanation'])(analysedSituation)
		if (!explanation) return null

		return (
			<section id="results" className={classNames({started: conversationStarted})}>
				<div id="results-titles">
					<h2>Vos obligations</h2>
					{conversationStarted &&
						<div>Cliquez pour comprendre chaque calcul &nbsp;<i className="fa fa-hand-o-right" aria-hidden="true"></i></div>}
				</div>
				<ul>
					{explanation.map(
						({variableName, nodeValue, explanation: {name, type, 'non applicable si': nonApplicable, formule: {nodeValue: computedValue}}}) =>
						do {
							let
								unsatisfied = nodeValue == null,
								nonApplicableValue = nonApplicable ? nonApplicable.nodeValue : false,
								irrelevant = nonApplicableValue === true || computedValue == 0,
								number = nonApplicableValue == false && computedValue != null,
								pointedOut = pointedOutObjectives.find(objective => objective == variableName)

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
										{conversationStarted && (
											irrelevant ?
												"Vous n'êtes pas concerné"
												: unsatisfied ?
													'En attente de vos réponses...'
													: <span className="figure">{humanFigure(2)(computedValue) + '€'}</span>
										)}
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
