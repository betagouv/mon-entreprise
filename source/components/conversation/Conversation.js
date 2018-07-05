import { getInputComponent } from 'Engine/generateQuestions'
import React, { Component } from 'react'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import {
	currentQuestionSelector,
	flatRulesSelector
} from 'Selectors/analyseSelectors'
import Aide from '../Aide'
import * as Animate from '../inFranceApp/animate'
import './conversation.css'

@reduxForm({
	form: 'conversation',
	destroyOnUnmount: false
})
@translate()
@connect(state => ({
	targetNames: state.targetNames,
	conversationStarted: state.conversationStarted,
	themeColours: state.themeColours,
	flatRules: flatRulesSelector(state),
	currentQuestion: currentQuestionSelector(state)
}))
export default class Conversation extends Component {
	render() {
		let { currentQuestion, flatRules, targetNames } = this.props
		return (
			<div className="conversationContainer">
				<Aide />
				<Animate.fromBottom>
					<div id="currentQuestion" key={currentQuestion}>
						{currentQuestion &&
							getInputComponent(flatRules, targetNames)(currentQuestion)}
					</div>
				</Animate.fromBottom>
			</div>
		)
	}
}
