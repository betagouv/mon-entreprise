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
		showCompactView: !!state.conversationSteps.foldedSteps.length
	}))
)(
	class SalaryExplanation extends React.Component {
		render() {
			return (
				<Animate.fromTop>
					{!this.props.showCompactView ? (
						<>
							<PageFeedback
								customMessage={
									<T k="feedback.simulator">
										Êtes-vous satisfait de ce simulateur ?
									</T>
								}
								customEventName="rate simulator"
							/>
							<SalaryFirstExplanation {...this.props} />
							{this.props.protectionText}
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
