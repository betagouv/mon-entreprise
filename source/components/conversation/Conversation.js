import React, { Component } from 'react'
import R from 'ramda'
import Aide from '../Aide'
import Satisfaction from '../Satisfaction'
import { reduxForm } from 'redux-form'
import Scroll from 'react-scroll'

@reduxForm({
	form: 'conversation',
	destroyOnUnmount: false
})
export default class Conversation extends Component {
	render() {
		let {
			foldedSteps,
			currentQuestion,
			reinitalise,
			textColourOnWhite,
			done,
			nextSteps
		} = this.props

		Scroll.animateScroll.scrollToBottom()
		return (
			<div id="conversation">
				<div id="questions-answers">
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
					{done && (
						<div className="tip">
							{nextSteps.length != 0 && (
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
				</div>
				<Aide />
			</div>
		)
	}
}
