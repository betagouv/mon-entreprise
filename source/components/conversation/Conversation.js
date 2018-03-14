import React, { Component } from 'react'
import { Trans, translate } from 'react-i18next'
import { isEmpty, map } from 'ramda'
import Aide from '../Aide'
import { reduxForm, reset } from 'redux-form'
import { scroller, Element } from 'react-scroll'
import { getInputComponent } from 'Engine/generateQuestions'
import Satisfaction from '../Satisfaction'
import { connect } from 'react-redux'
import './conversation.css'

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
@translate()
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
				<Element name="myScrollToElement" id="myScrollToElement">
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
