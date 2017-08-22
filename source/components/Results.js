import R from 'ramda'
import React, { Component } from 'react'
import classNames from 'classnames'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import { withRouter } from 'react-router'
import {formValueSelector} from 'redux-form'

import './Results.css'
import {clearDict} from 'Engine/traverse'
import {encodeRuleName} from 'Engine/rules'
import {getObjectives} from 'Engine/generateQuestions'
import ResultVignette from './ResultVignette'

@withRouter
@connect(
	state => ({
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
				<div>
					<div id="results-titles">
							<h3>Votre résultat</h3>
							{do {let text = R.path(['simulateur', 'résultats'])(analysedSituation.root)
								text &&
									<p id="resultText">{text}</p>
							}}
					</div>
					<ResultVignette
						conversationStarted={conversationStarted}
						key="1"
						{...explanation[0]} />
				</div>
				<div id="explanation">

				</div>
				<p id="understandTip"><i className="fa fa-lightbulb-o" aria-hidden="true"></i><em>Cliquez pour comprendre chaque calcul</em></p>
			</section>
		)
	}
}
