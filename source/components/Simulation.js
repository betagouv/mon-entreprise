import Conversation from 'Components/conversation/Conversation'
import TargetSelection from 'Components/TargetSelection'
import React from 'react'
import { connect } from 'react-redux'
import { firstStepCompletedSelector } from 'Selectors/analyseSelectors'

export default connect(state => ({
	firstStepCompleted: firstStepCompletedSelector(state)
}))(function Simulation({
	firstStepCompleted,
	explanations,
	customEndMessages
}) {
	return (
		<>
			<TargetSelection />
			{firstStepCompleted && (
				<>
					<h2>Votre simulation</h2>
					<Conversation customEndMessages={customEndMessages} />
					{explanations}
				</>
			)}
		</>
	)
})
