import React, { Component } from 'react'
import { connect } from "react-redux"
import { withRouter } from "react-router"
import './ProgressTip.css'

@withRouter
@connect(state => ({
	done: state.done,
	foldedSteps: state.foldedSteps,
	nextSteps: state.nextSteps,
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
		let {done, nextSteps, foldedSteps} = this.props
		if (!done) return null
		return (
			<div className="tip">
				{nextSteps.length != 0 &&
					this.state.nbFoldedStepsForFirstEstimation ===
						foldedSteps.length && (
						<p>Votre première estimation est disponible !</p>
					)}
				{nextSteps.length != 0 && (
					<p>
						Il reste environ {nextSteps.length}{' '}
						{nextSteps.length === 1 ? 'question' : 'questions'}
						<progress
							value={foldedSteps.length}
							max={foldedSteps.length + nextSteps.length}
						/>
					</p>
				)}
			</div>
		)
	}
}
