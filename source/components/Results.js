import R from 'ramda'
import React, { Component } from 'react'
import classNames from 'classnames'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import { withRouter } from 'react-router'

import './Results.css'
import {clearDict} from 'Engine/traverse'
import {encodeRuleName} from 'Engine/rules'
import RuleValueVignette from './rule/RuleValueVignette'

@withRouter
@connect(
	state => ({
		analysis: state.analysis,
		targetName: state.targetName,
		conversationStarted: !R.isEmpty(state.form),
		conversationFirstAnswer: R.path(['form', 'conversation', 'values'])(state),
		situationGate: state.situationGate
	})
)
export default class Results extends Component {
	render() {
		let {
			analysis,
			targetName,
			conversationStarted,
			conversationFirstAnswer,
			location
		} = this.props

		if (!analysis) return null

		let {targets} = analysis

		let onRulePage = R.contains('/regle/')(location.pathname)
		return (
			<section ref={el => this.el = el} id="results">
				{onRulePage && conversationStarted ?
					<div id ="results-actions">
						<Link id="toSimulation" to={'/simu/' + encodeRuleName(targetName)}>
							<i className="fa fa-arrow-circle-left" aria-hidden="true"></i>Reprendre la simulation
						</Link>
					</div>
					: <div id="results-titles">
						<h2><i className="fa fa-calculator" aria-hidden="true"></i>{targets.length == 1 ? 'Votre objectif' : 'Vos objectifs'}</h2>
					</div>
				}
				<Link
					className="edit"
					to="/"
				>
					<i className="fa fa-pencil-square-o" aria-hidden="true" />
					{'  '}
					<span>Modifier</span>
				</Link>
				<ul>
					{targets.map( rule => <li key={rule.nom}>
						<RuleValueVignette {...rule} conversationStarted={conversationStarted} />
					</li>)}
				</ul>
			</section>
		)
	}
}
