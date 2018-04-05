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
							trailWidth="1"
							strokeWidth="2"
							strokeColor={colour}
						/>
					)}
					<p>
						{nbQuestions === 1
							? 'une dernière question !'
							: `moins de ${nbQuestions} questions`}
					</p>
				</div>
			)
		)
	}
}
