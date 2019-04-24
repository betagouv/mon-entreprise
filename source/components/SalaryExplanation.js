import { React, T } from 'Components'
import PageFeedback from 'Components/Feedback/PageFeedback'
import withTracker from 'Components/utils/withTracker'
import { compose } from 'ramda'
import { connect } from 'react-redux'
import * as Animate from 'Ui/animate'
import SalaryCompactExplanation from './SalaryCompactExplanation'
import SalaryFirstExplanation from './SalaryFirstExplanation'

export default compose(
	withTracker,
	connect(state => ({
		conversationStarted: state.conversationStarted
	}))
)(
	class SalaryExplanation extends React.Component {
		render() {
			return (
				<Animate.fromTop delay={this.props.conversationStarted ? 0 : 1000}>
					{!this.props.conversationStarted ? (
						<>
							{this.props.protectionText}
							<PageFeedback
								customMessage={
									<T k="feedback.simulator">
										Êtes-vous satisfait de ce simulateur ?
									</T>
								}
								customEventName="rate simulator"
							/>
							<SalaryFirstExplanation {...this.props} />
						</>
					) : (
						<>
							<SalaryCompactExplanation {...this.props} />
							<PageFeedback
								customMessage={
									<T k="feedback.simulator">
										Êtes-vous satisfait de ce simulateur ?
									</T>
								}
								customEventName="rate simulator"
							/>
						</>
					)}
					<div style={{ textAlign: 'center' }} />
				</Animate.fromTop>
			)
		}
	}
)
