import React, { Component } from 'react'
import withTracker from 'Components/utils/withTracker'
import { compose } from 'ramda'
import { connect } from 'react-redux'
import ficheDePaieSelectors from 'Selectors/ficheDePaieSelectors'
import './SalaryCompactExplanation.css'
import SalaryFirstExplanation from './SalaryFirstExplanation'
import SalaryCompactExplanation from './SalaryCompactExplanation'
import * as Animate from 'Ui/animate'
import { startConversation } from 'Actions/actions'
import { formValueSelector } from 'redux-form'

export default compose(
	withTracker,
	connect(
		state => ({
			conversationStarted: state.conversationStarted,
			displayResults: !!ficheDePaieSelectors(state),
			arePreviousAnswers: state.conversationSteps.foldedSteps.length > 0,
			period: formValueSelector('conversation')(state, 'période')
		}),
		{
			startConversation
		}
	)
)(
	class SalaryExplanation extends Component {
		render() {
			return (
				<Animate.fromBottom>
					{!this.props.conversationStarted ? (
						<SalaryFirstExplanation {...this.props} />
					) : (
						<SalaryCompactExplanation {...this.props} />
					)}
					<div style={{ textAlign: 'center' }} />
				</Animate.fromBottom>
			)
		}
	}
)
