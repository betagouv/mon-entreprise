import { startConversation } from 'Actions/actions'
import withTracker from 'Components/utils/withTracker'
import { compose } from 'ramda'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'
import ficheDePaieSelectors from 'Selectors/ficheDePaieSelectors'
import * as Animate from 'Ui/animate'
import SalaryCompactExplanation from './SalaryCompactExplanation'
import './SalaryCompactExplanation.css'
import SalaryFirstExplanation from './SalaryFirstExplanation'

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
				<Animate.fromBottom delay={2000}>
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
