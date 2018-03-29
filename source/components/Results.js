import { isEmpty, path, contains } from 'ramda'
import React, { Component } from 'react'
import { Trans, translate } from 'react-i18next'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import './Results.css'
import RuleValueVignette from './rule/RuleValueVignette'
import ProgressTip from 'Components/ProgressTip'
import { findRuleByDottedName } from 'Engine/rules.js'

@withRouter
@connect(state => ({
	analysis: state.analysis,
	flatRules: state.flatRules,
	targetName: state.targetName,
	conversationStarted: !isEmpty(state.form),
	conversationFirstAnswer: path(['form', 'conversation', 'values'])(state),
	situationGate: state.situationGate,
	done: state.done,
	themeColours: state.themeColours
}))
@translate()
export default class Results extends Component {
	render() {
		let { flatRules, analysis, conversationStarted, done, themeColours } = this.props
			let withFlatRule = rule => ({
				...rule,
				flatRule: findRuleByDottedName(flatRules, rule.dottedName)
			})

		if (!analysis) return null

		let { targets } = analysis

		let textStyle = { color: themeColours.textColour }

		return (
			<div id="resultsZone">
				<section id="results">
					<ProgressTip />
					<div id="resultsContent" style={{ background: themeColours.colour }}>
						<Link className="edit" to="/" style={textStyle}>
							<i className="fa fa-pencil" aria-hidden="true" />
							{'  '}
							<span><Trans i18nKey="reset">Changer d'objectif</Trans></span>
						</Link>
						<ul>
							{targets.map(rule => (
								<li key={rule.nom} style={textStyle}>
									<RuleValueVignette
										{...withFlatRule(rule)}
										conversationStarted={conversationStarted}
									/>
								</li>
							))}
						</ul>
					</div>
					<h3
						className="scrollIndication down"
						style={{
							opacity: done ? 1 : 0,
							color: themeColours.textColourOnWhite
						}}
					>
						<i className="fa fa-long-arrow-down" aria-hidden="true" />{' '}
						<Trans i18nKey="details">Comprendre mes résultats</Trans>
					</h3>
				</section>
			</div>
		)
	}
}
