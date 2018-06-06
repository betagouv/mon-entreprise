import React, { Component } from 'react'
import { translate } from 'react-i18next'
import { pick } from 'ramda'
import Aide from '../Aide'
import { reduxForm } from 'redux-form'
import { getInputComponent } from 'Engine/generateQuestions'
import { connect } from 'react-redux'
import './conversation.css'

import {
	flatRulesSelector,
	currentQuestionSelector
} from 'Selectors/analyseSelectors'

@reduxForm({
	form: 'conversation',
	destroyOnUnmount: false
})
@translate()
@connect(state => ({
	targetNames: state.targetNames,
	conversationStarted: state.conversationStarted,
	themeColours: state.themeColours,
	foldedSteps: state.foldedSteps,
	flatRules: flatRulesSelector(state),
	currentQuestion: currentQuestionSelector(state)
}))
export default class Conversation extends Component {
	render() {
		let { currentQuestion, flatRules, targetNames } = this.props
		return (
			<div className="conversationContainer">
				<Aide />
				<div id="currentQuestion">
					{currentQuestion &&
						getInputComponent({ unfolded: true })(flatRules, targetNames)(
							currentQuestion
						)}
				</div>
			</div>
		)
	}
}
