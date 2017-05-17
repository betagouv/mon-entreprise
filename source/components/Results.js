import React, { Component } from 'react'
import classNames from 'classnames'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import R from 'ramda'
import './Results.css'
import {capitalise0} from '../utils'
import {computeRuleValue} from '../engine/traverse'
import {encodeRuleName, getObjectives} from '../engine/rules'

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
		let {analysedSituation, pointedOutObjectives, conversationStarted} = this.props,

			explanation = getObjectives(analysedSituation)
		if (!explanation) return null

		return (
			<section id="results" className={classNames({started: conversationStarted})}>
				<div id="results-titles">
					<h2>Vos résultats <i className="fa fa-hand-o-right" aria-hidden="true"></i></h2>
					{do {let text = R.path(['simulateur', 'résultats'])(analysedSituation)
						text &&
							<p id="resultText">{text}</p>
						}}
					{conversationStarted &&
						<p id="understandTip"><i className="fa fa-lightbulb-o" aria-hidden="true"></i><em>Cliquez pour comprendre chaque calcul</em></p>}
				</div>
				<ul>
					{explanation.map(
						({name, dottedName, type, 'non applicable si': nonApplicable, formule: {nodeValue: formuleValue}}) =>
						do {
							//TODO quel bordel, à revoir
							let
								ruleValue = computeRuleValue(formuleValue, nonApplicable && nonApplicable.nodeValue),
								unsatisfied = ruleValue == null,
								nonApplicableValue = nonApplicable ? nonApplicable.nodeValue : false,
								irrelevant = nonApplicableValue === true || formuleValue == 0,
								number = nonApplicableValue == false && formuleValue != null,
								pointedOut = pointedOutObjectives.find(objective => objective == dottedName)

								;<li key={name} className={classNames({unsatisfied, irrelevant, number, pointedOut})}>
								<Link to={"/regle/" + encodeRuleName(name)} >
									<div className="rule-box">
										<div className="rule-type">
											{type}
										</div>
										<div className="rule-name">
											{capitalise0(name)}
										</div>
										<p>
										{conversationStarted && (
											irrelevant ?
												"Vous n'êtes pas concerné"
												: unsatisfied ?
													'En attente de vos réponses...'
													: <span className="figure">{humanFigure(2)(formuleValue) + '€'}</span>
										)}
										</p>
									</div>
								</Link>
								{/* <div className="pointer">•</div> */}
							</li>
						}
					)}
				</ul>
			</section>
		)
	}
}
