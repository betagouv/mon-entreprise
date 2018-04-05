import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import './ProgressTip.css'
import { Line } from 'rc-progress'

@withRouter
@connect(state => ({
	foldedSteps: state.foldedSteps,
	nextSteps: state.nextSteps,
	colour: state.themeColours.colour,
	conversationTargetNames: state.conversationTargetNames
}))
export default class ProgressTip extends Component {
	render() {
		let {
				nextSteps,
				foldedSteps,
				colour,
				conversationTargetNames
			} = this.props,
			nbQuestions = nextSteps.length

		if (conversationTargetNames && conversationTargetNames.length === 0)
			return nbQuestions ? (
				<p>Vous aurez {nextSteps.length} questions !</p>
			) : null
		if (!conversationTargetNames) return null
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
