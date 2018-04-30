import React, { Component } from 'react'
import { Trans, translate } from 'react-i18next'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import './ProgressTip.css'
import { Line } from 'rc-progress'
import { pick } from 'ramda'

@withRouter
@translate()
@connect(
	pick(['foldedSteps', 'nextSteps', 'themeColours', 'conversationStarted'])
)
export default class ProgressTip extends Component {
	render() {
		let {
				nextSteps,
				foldedSteps,
				themeColours: { colour, textColourOnWhite },
				conversationStarted
			} = this.props,
			nbQuestions = nextSteps.length

		if (!conversationStarted) return null
		return (
				<div className="progressTip">
					{ nbQuestions != 0
					?
					<p style={{ color: textColourOnWhite }}>
						{nbQuestions === 1
							?
							<Trans i18nKey="lastQ">dernière question !</Trans>
							:
							<Trans i18nKey="questionsLeft" count={nbQuestions}>
							moins de {{nbQuestions}} questions
							</Trans>
						}
					</p>
					:
					<br/>}
				</div>
		)
	}
}
