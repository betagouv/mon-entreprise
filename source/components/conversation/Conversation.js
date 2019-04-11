import Scroll from 'Components/utils/Scroll'
import { getInputComponent } from 'Engine/generateQuestions'
import { compose } from 'ramda'
import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import {
	currentQuestionSelector,
	flatRulesSelector
} from 'Selectors/analyseSelectors'
import * as Animate from 'Ui/animate'
import Aide from '../Aide'
import './conversation.css'

export default compose(
	reduxForm({
		form: 'conversation',
		destroyOnUnmount: false
	}),
	withTranslation(),
	connect(state => ({
		conversationStarted: state.conversationStarted,
		flatRules: flatRulesSelector(state),
		currentQuestion: currentQuestionSelector(state)
	}))
)(
	class Conversation extends Component {
		render() {
			let { currentQuestion, flatRules } = this.props
			return (
				<Scroll.toElement onlyIfNotVisible>
					<div className="conversationContainer">
						<Aide />
						<div id="currentQuestion">
							{currentQuestion && (
								<Animate.fadeIn>
									{getInputComponent(flatRules)(currentQuestion)}
								</Animate.fadeIn>
							)}
						</div>
					</div>
				</Scroll.toElement>
			)
		}
	}
)
