import React, { Component } from 'react'
import R from 'ramda'
import Aide from '../Aide'
import Satisfaction from '../Satisfaction'
import { reduxForm } from 'redux-form'
import { scroller, Element } from 'react-scroll'

@reduxForm({
	form: 'conversation',
	destroyOnUnmount: false
})
export default class Conversation extends Component {
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
		let {
			foldedSteps,
			currentQuestion,
			reinitalise,
			textColourOnWhite,
			done,
			nextSteps
		} = this.props

		scroller.scrollTo('myScrollToElement', {
			duration: 200,
			delay: 100,
			smooth: true
		})

		return (
			<>
				{!R.isEmpty(foldedSteps) && (
					<div id="foldedSteps">
						<div className="header">
							<h2>
								<i className="fa fa-mouse-pointer" aria-hidden="true" />Vos
								réponses
							</h2>
							<button
								onClick={reinitalise}
								style={{ color: textColourOnWhite }}
							>
								<i className="fa fa-trash" aria-hidden="true" />
								Tout effacer
							</button>
						</div>
						{foldedSteps}
					</div>
				)}
				<Element name="myScrollToElement" id="myScrollToElement">
					{done && (
						<div className="tip">
							{nextSteps.length != 0 &&
								this.state.nbFoldedStepsForFirstEstimation ===
									foldedSteps.length && (
									<p>Votre première estimation est disponible !</p>
								)}
							{nextSteps.length != 0 && (
								<p>
									Il vous reste environ {nextSteps.length}{' '}
									{nextSteps.length === 1 ? 'questions' : 'question'} pour
									affiner le calcul
									<progress
										value={foldedSteps.length}
										max={foldedSteps.length + nextSteps.length}
									/>
								</p>
							)}
						</div>
					)}
					<div id="currentQuestion">
						{currentQuestion || <Satisfaction simu={this.props.simu} />}
					</div>
				</Element>
				<Aide />
			</>
		)
	}
}
