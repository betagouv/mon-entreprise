import React, { Component } from 'react'
import { Trans } from 'react-i18next'
import { connect } from 'react-redux'
import { nextStepsSelector } from 'Selectors/analyseSelectors'
import './ProgressTip.css'

export default connect(state => ({
	nextSteps: nextStepsSelector(state)
}))(
	class ProgressTip extends Component {
		render() {
			let { nextSteps } = this.props,
				nbQuestions = nextSteps.length
			if (nbQuestions === 0) return null

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
)
