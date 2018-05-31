import React, { Component } from 'react'
import { translate } from 'react-i18next'
import { pick } from 'ramda'
import Aide from '../Aide'
import { reduxForm } from 'redux-form'
import { getInputComponent } from 'Engine/generateQuestions'
import { connect } from 'react-redux'
import './conversation.css'

@reduxForm({
	form: 'conversation',
	destroyOnUnmount: false
})
@translate()
@connect(
	pick(['currentQuestion', 'flatRules', 'targetNames', 'conversationStarted'])
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
							{currentQuestion &&
								getInputComponent({ unfolded: true })(flatRules, targetNames)(
									currentQuestion
								)}
						</div>
					</>
				) : null}
			</div>
		)
	}
}
