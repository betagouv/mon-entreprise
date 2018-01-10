import { isEmpty, path, contains } from 'ramda'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import './Results.css'
import RuleValueVignette from './rule/RuleValueVignette'
import ProgressTip from 'Components/ProgressTip'

@withRouter
@connect(state => ({
	analysis: state.analysis,
	targetName: state.targetName,
	conversationStarted: !isEmpty(state.form),
	conversationFirstAnswer: path(['form', 'conversation', 'values'])(state),
	situationGate: state.situationGate,
	done: state.done
}))
export default class Results extends Component {
	render() {
		let {
			analysis,
			targetName,
			conversationStarted,
			conversationFirstAnswer,
			location,
			done
		} = this.props

		if (!analysis) return null

		let { targets } = analysis

		let onRulePage = contains('/regle/')(location.pathname)
		return (
			<div id="resultsZone">
				<section id="results">
					<ProgressTip />
					<div id="resultsContent">
						<Link className="edit" to="/">
							<i className="fa fa-pencil-square-o" aria-hidden="true" />
							{'  '}
							<span>Changer d'objectif</span>
						</Link>
						<ul>
							{targets.map(rule => (
								<li key={rule.nom}>
									<RuleValueVignette
										{...rule}
										conversationStarted={conversationStarted}
									/>
								</li>
							))}
						</ul>
					</div>
					<h3
						className="scrollIndication down"
						style={{ opacity: done ? 1 : 0 }}
					>
						<i className="fa fa-long-arrow-down" aria-hidden="true" />{' '}
						Comprendre mes résultats
					</h3>
				</section>
			</div>
		)
	}
}
