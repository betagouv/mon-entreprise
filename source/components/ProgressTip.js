import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import './ProgressTip.css'
import { Line } from 'rc-progress'

@withRouter
@connect(state => ({
	foldedSteps: state.foldedSteps,
	nextSteps: state.nextSteps,
	colour: state.themeColours.colour
}))
export default class ProgressTip extends Component {
	render() {
		let {
				done,
				nextSteps,
				foldedSteps,
				colour,
				conversationVisible,
				selectingTargets
			} = this.props,
			nbQuestions = nextSteps.length

		if (selectingTargets && !conversationVisible)
			return nbQuestions ? (
				<p>Vous aurez {nextSteps.length} questions !</p>
			) : null
		if (!conversationVisible) return null
		return (
			<div className="tip">
				{nbQuestions != 0 && (
					<p>
						{nbQuestions === 1
							? 'Une dernière question !'
							: `Il reste moins de ${nbQuestions} questions`}
						<Line
							percent={
								100 * foldedSteps.length / (foldedSteps.length + nbQuestions)
							}
							strokeWidth="1"
							strokeColor={colour}
							trailColor="white"
							strokeLinecap="butt"
						/>
					</p>
				)}
			</div>
		)
	}
}
