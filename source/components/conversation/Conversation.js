import Scroll from 'Components/utils/Scroll'
import { getInputComponent } from 'Engine/generateQuestions'
import { compose } from 'ramda'
import React, { Component } from 'react'
import { withNamespaces } from 'react-i18next'
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
	withNamespaces(),
	connect((state, { simulationConfig }) => ({
		conversationStarted: state.conversationStarted,
		themeColours: state.themeColours,
		flatRules: flatRulesSelector(state),
		currentQuestion: currentQuestionSelector(state, simulationConfig)
	}))
)(
	class Conversation extends Component {
		render() {
			let { currentQuestion, flatRules } = this.props
			return (
				<div className="conversationContainer">
					<Aide />
					<div id="currentQuestion">
						{currentQuestion && (
							<Animate.fadeIn>
								<Scroll.toElement onlyIfNotVisible />
								{getInputComponent(flatRules)(currentQuestion)}
							</Animate.fadeIn>
						)}
					</div>
				</div>
			)
		}
	}
)
