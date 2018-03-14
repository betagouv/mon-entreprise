import React, { Component } from 'react'
import { isEmpty, map } from 'ramda'
import Aide from '../Aide'
import { reduxForm, reset } from 'redux-form'
import { scroller, Element } from 'react-scroll'
import { getInputComponent } from 'Engine/generateQuestions'
import Satisfaction from '../Satisfaction'
import { connect } from 'react-redux'
import './conversation.css'

import ReactPiwik from '../Tracker'
let scroll = () =>
	scroller.scrollTo('myScrollToElement', {
		duration: 500,
		delay: 0,
		smooth: true
	})

@reduxForm({
	form: 'conversation',
	destroyOnUnmount: false
})
@connect(
	state => ({
		currentQuestion: state.currentQuestion,
		foldedSteps: state.foldedSteps,
		themeColours: state.themeColours,
		situationGate: state.situationGate,
		targetNames: state.targetNames,
		done: state.done,
		nextSteps: state.nextSteps,
		analysis: state.analysis,
		parsedRules: state.parsedRules
	}),
	dispatch => ({
		reinitialise: () => {
			ReactPiwik.push(['trackEvent', 'restart', ''])
			dispatch(reset('conversation'))
			dispatch({ type: 'SET_CONVERSATION_TARGETS', reset: true })
		}
	})
)
export default class Conversation extends Component {
	componentWillReceiveProps(nextProps) {
		if (nextProps.foldedSteps.length == this.props.foldedSteps.length)
			return null

		setTimeout(scroll, 1) // scrolling after the first answer doesn't work
	}
	render() {
		let {
			foldedSteps,
			currentQuestion,
			parsedRules,
			targetNames,
			reinitialise,
			textColourOnWhite
		} = this.props
		return (
			<>
				{!isEmpty(foldedSteps) && (
					<div id="foldedSteps">
						<div className="header">
							<button
								onClick={reinitialise}
								style={{ color: textColourOnWhite }}
							>
								<i className="fa fa-trash" aria-hidden="true" />
								Tout effacer
							</button>
						</div>
						{map(
							getInputComponent({ unfolded: false })(parsedRules, targetNames),
							foldedSteps
						)}
					</div>
				)}
				<Element name="myScrollToElement" id="myScrollToElement">
					<h3
						className="scrollIndication up"
						style={{
							opacity: foldedSteps.length != 0 ? 1 : 0,
							color: textColourOnWhite
						}}
					>
						<i className="fa fa-long-arrow-up" aria-hidden="true" /> Modifier
						mes réponses
					</h3>
					<div id="currentQuestion">
						{currentQuestion ? (
							getInputComponent({ unfolded: true })(parsedRules, targetNames)(
								currentQuestion
							)
						) : (
							<Satisfaction />
						)}
					</div>
					<Aide />
				</Element>
			</>
		)
	}
}
