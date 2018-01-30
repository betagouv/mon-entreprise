import React, { Component } from 'react'
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
						<p>Votre première estimation est disponible !</p>
					)}
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
