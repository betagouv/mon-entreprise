import React, { Component } from 'react'
import { Trans } from 'react-i18next'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import './ProgressTip.css'
import { Line } from 'rc-progress'

@withRouter
@connect(state => ({
	done: state.done,
	foldedSteps: state.foldedSteps,
	nextSteps: state.nextSteps,
	colour: state.themeColours.colour
}))
export default class ProgressTip extends Component {
	state = {
		nbFoldedStepsForFirstEstimation: null
	}
	componentWillReceiveProps(newProps) {
		if (newProps.done && this.state.nbFoldedStepsForFirstEstimation == null)
			this.setState({
				nbFoldedStepsForFirstEstimation: newProps.foldedSteps.length
			})
	}
	render() {
		let { done, nextSteps, foldedSteps, colour } = this.props,
			nbQuestions = nextSteps.length
		if (!done) return null
		return (
			<div className="tip">
				{nbQuestions != 0 &&
					this.state.nbFoldedStepsForFirstEstimation === foldedSteps.length && (
						<p><Trans i18nKey="first">Votre première estimation est disponible !</Trans></p>
					)}
				{nbQuestions != 0 && (
					<p>
						{nbQuestions === 1
							?
							<Trans i18nKey="lastQ">Une dernière question !</Trans>
							:
							<Trans i18nKey="questionsLeft" count={nbQuestions}>
							Il reste moins de {{nbQuestions}} questions.
							</Trans>
						}
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
