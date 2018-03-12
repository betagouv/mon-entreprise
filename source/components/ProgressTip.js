import React, { Component } from 'react'
import { Trans, translate } from 'react-i18next'
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
@translate()
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
			return <p>Vous aurez {nextSteps.length} questions !</p>
		if (!conversationVisible) return null
		return (
			<div className="tip">
				{nbQuestions != 0 && (
					<p>
						{nbQuestions === 1 ? (
							<Trans i18nKey="lastQ">Une dernière question !</Trans>
						) : (
							<Trans i18nKey="questionsLeft" count={nbQuestions}>
								Il reste moins de {{ nbQuestions }} questions.
							</Trans>
						)}
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
