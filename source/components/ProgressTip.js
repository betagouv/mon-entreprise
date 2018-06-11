import React, { Component } from 'react'
import { Trans, translate } from 'react-i18next'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import './ProgressTip.css'
import { nextStepsSelector } from 'Selectors/analyseSelectors'
import withColours from './withColours'

@withRouter
@translate()
@withColours
@connect(state => ({
	nextSteps: nextStepsSelector(state)
}))
export default class ProgressTip extends Component {
	render() {
		let {
				nextSteps,
				colours: { textColourOnWhite }
			} = this.props,
			nbQuestions = nextSteps.length

		return (
			<div className="progressTip">
				{nbQuestions != 0 ? (
					<p style={{ color: textColourOnWhite }}>
						{nbQuestions === 1 ? (
							<Trans i18nKey="lastQ">dernière question !</Trans>
						) : (
							<Trans i18nKey="questionsLeft" count={nbQuestions}>
								moins de {{ nbQuestions }} questions
							</Trans>
						)}
					</p>
				) : (
					<br />
				)}
			</div>
		)
	}
}
