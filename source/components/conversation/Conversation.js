import React, { Component } from 'react'
import { translate } from 'react-i18next'
import { pick } from 'ramda'
import Aide from '../Aide'
import { reduxForm, reset } from 'redux-form'
import { getInputComponent } from 'Engine/generateQuestions'
import Satisfaction from '../Satisfaction'
import { connect } from 'react-redux'
import './conversation.css'

@reduxForm({
	form: 'conversation',
	destroyOnUnmount: false
})
@translate()
@connect(
	pick([
		'currentQuestion',
		'foldedSteps',
		'themeColours',
		'situationGate',
		'targetNames',
		'done',
		'nextSteps',
		'analysis',
		'flatRules',
		'conversationStarted'
	]),
	dispatch => ({
		reinitialise: () => {
			dispatch(reset('conversation'))
			dispatch({ type: 'SET_CONVERSATION_TARGETS', reset: true })
		}
	})
)
export default class Conversation extends Component {
	render() {
		let {
			currentQuestion,
			flatRules,
			targetNames,
			conversationStarted
		} = this.props
		return (
			<div className="conversationContainer">
				{conversationStarted ? (
					<>
						<Aide />
						<div id="currentQuestion">
							{currentQuestion ? (
								getInputComponent({ unfolded: true })(flatRules, targetNames)(
									currentQuestion
								)
							) : (
								<Satisfaction />
							)}
						</div>
					</>
				) : null}
			</div>
		)
	}
}
