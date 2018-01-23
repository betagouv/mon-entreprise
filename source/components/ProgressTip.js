import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import './ProgressTip.css'

@withRouter
@connect(state => ({
	done: state.done,
	foldedSteps: state.foldedSteps,
	nextSteps: state.nextSteps,
	textColourOnWhite: state.themeColours.textColourOnWhite
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
		let { done, nextSteps, foldedSteps, textColourOnWhite } = this.props,
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
						<ProgressBar
							foldedSteps={foldedSteps}
							nbQuestions={nbQuestions}
							colour={textColourOnWhite}
						/>
					</p>
				)}
			</div>
		)
	}
}

let ProgressBar = ({ foldedSteps, nbQuestions, colour }) => (
	<progress
		value={foldedSteps.length}
		max={foldedSteps.length + nbQuestions}
		style={{
			borderColor: colour
		}}
	/>
)
