import { pick } from 'ramda'
import React, { Component } from 'react'
import { Trans, translate } from 'react-i18next'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import './ProgressTip.css'

@withRouter
@translate()
@connect(pick(['foldedSteps', 'nextSteps', 'conversationStarted']))
export default class ProgressTip extends Component {
	render() {
		let { nextSteps, conversationStarted } = this.props,
			nbQuestions = nextSteps.length

		if (!conversationStarted || nbQuestions === 0) return null
		return (
			<div className="progressTip">
				<p>
					{nbQuestions === 1 ? (
						<Trans i18nKey="lastQ">dernière question !</Trans>
					) : (
						<Trans i18nKey="questionsLeft" count={nbQuestions}>
							moins de {{ nbQuestions }} questions
						</Trans>
					)}
				</p>
			</div>
		)
	}
}
