import React, { Component } from 'react'
import { isEmpty, map } from 'ramda'
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
		parsedRules: state.parsedRules,
		conversationTargetNames: state.conversationTargetNames
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
	render() {
		let {
			foldedSteps,
			currentQuestion,
			parsedRules,
			targetNames,
			reinitialise,
			textColourOnWhite,
			conversationTargetNames
		} = this.props
		if ((conversationTargetNames || []).length === 0) return null
		return (
			<>
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
			</>
		)
	}
}
