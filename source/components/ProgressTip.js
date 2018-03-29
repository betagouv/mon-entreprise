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
				themeColours: { colour },
				conversationStarted
			} = this.props,
			nbQuestions = nextSteps.length

		if (!conversationStarted) return null
		return (
			nbQuestions != 0 && (
				<div className="progressTip">
					{foldedSteps.length > 0 && (
						<Line
							percent={
								100 * foldedSteps.length / (foldedSteps.length + nbQuestions)
							}
							strokeWidth="1"
							strokeColor={colour}
							strokeLinecap="butt"
						/>
					)}
					<p>
						{nbQuestions === 1
							? 'Une dernière question !'
							: `Moins de ${nbQuestions} questions`}
					</p>
				</div>
			)
		)
	}
}
