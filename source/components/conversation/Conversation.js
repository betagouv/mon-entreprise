import Scroll from 'Components/utils/Scroll'
import { getInputComponent } from 'Engine/generateQuestions'
import React, { Component } from 'react'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import {
	currentQuestionSelector,
	flatRulesSelector
} from 'Selectors/analyseSelectors'
import * as Animate from 'Ui/animate'
import Aide from '../Aide'
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
				<Scroll.toElement onlyIfNotVisible key={currentQuestion} />
				<div id="currentQuestion">
					{currentQuestion && (
						<Animate.fadeIn>
							{getInputComponent(flatRules, targetNames)(currentQuestion)}
						</Animate.fadeIn>
					)}
				</div>
			</div>
		)
	}
}
