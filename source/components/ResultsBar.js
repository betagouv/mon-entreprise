import R from 'ramda'
import React, { Component } from 'react'
import classNames from 'classnames'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import { withRouter } from 'react-router'
import {formValueSelector} from 'redux-form'

import './ResultsBar.css'
import {capitalise0} from '../utils'
import {computeRuleValue, clearDict} from 'Engine/traverse'
import {encodeRuleName} from 'Engine/rules'
import {getObjectives} from 'Engine/generateQuestions'

let fmt = new Intl.NumberFormat('fr-FR').format
let humanFigure = decimalDigits => value => fmt(value.toFixed(decimalDigits))

@withRouter
@connect(
	state => ({
		pointedOutObjectives: state.pointedOutObjectives,
		analysedSituation: state.analysedSituation,
		conversationStarted: !R.isEmpty(state.form),
		conversationFirstAnswer: R.path(['form', 'conversation', 'values'])(state),
		situationGate: (name => formValueSelector('conversation')(state, name))
	})
)
export default class Results extends Component {
	render() {
		let {
			analysedSituation,
			pointedOutObjectives,
			conversationStarted,
			conversationFirstAnswer: showResults,
			situationGate,
			location
		} = this.props


		let explanation = R.has('root', analysedSituation) && clearDict() && getObjectives(situationGate, analysedSituation.root, analysedSituation.parsedRules)

		if (!explanation) return null

		let onRulePage = R.contains('/regle/')(location.pathname)

		return (
			<section id="results" className={classNames({show: showResults})}>
				{onRulePage && conversationStarted ?
					<div id ="results-actions">
						<Link id="toSimulation" to={"/simu/" + encodeRuleName(analysedSituation.root.name)}>
							<i className="fa fa-arrow-circle-left" aria-hidden="true"></i>Reprendre la simulation
						</Link>
					</div>
				: <div id="results-titles">
						<h2>Vos résultats <i className="fa fa-hand-o-right" aria-hidden="true"></i></h2>
						{do {let text = R.path(['simulateur', 'résultats'])(analysedSituation.root)
							text &&
								<p id="resultText">{text}</p>
						}}
						<p id="understandTip"><i className="fa fa-lightbulb-o" aria-hidden="true"></i><em>Cliquez pour comprendre chaque calcul</em></p>
				</div>
				}
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
								pointedOut =
									pointedOutObjectives.find(objective => objective == dottedName)
								|| R.contains(encodeRuleName(name))(location.pathname)

								;<li key={name} className={classNames({unsatisfied, irrelevant, number, pointedOut})}>


								<Link to={"/regle/" + encodeRuleName(name)} >
									<div className="rule-type">
										{type}
									</div>
									<div className="rule-box">

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
